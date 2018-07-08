import {Socket} from "socket.io";
import SocketIO = require("socket.io");
import {IEvent} from "../Event";
import {Lobby} from "../Lobby/Lobby";
import {Utility} from "../Utility";
import {User} from "../User/User";
import {UserRepository} from "../User/UserRepository";
import {StatsManager} from "../Stats/StatsManager";

/**
 * Used to manage login/room list/register etc. requests
 * Every Request returns one or several responses
 * packaged as an IEvent[]
 */
export class SessionManager {

    private _lobby: Lobby;
    private _registeredNames: Map<string, User>; // Secretkey -> User object

    constructor() {
        this._lobby = new Lobby();
        this._registeredNames = new Map();
        // Load existing users
        UserRepository.instance.getAll().then((users) => {
            users.forEach((user) => {
                this._registeredNames.set(user.key, user);
            });
        });
    }

    /**
     * Add Client to room if he is not yet in a room
     * Informs client and other clients in room that he joined
     * @param {SocketIO.Socket} socket
     * @param {IJoinRoomRequest} req
     */
    public joinRoom(socket: Socket, req: IJoinRoomRequest): IEvent[] {
        const userObject = this._registeredNames.get(req.playerKey);
        if (!userObject) return [this._lobby.nameNotRegisteredEvent(socket)];
        return this._lobby.joinRoom(socket, req, userObject);
    }

    /**
     * Remove Client from room
     * Informs client and other clients in room that he left
     * @param {SocketIO.Socket} socket
     * @param {ILeaveRoomRequest} req
     */
    public leaveRoom(socket: Socket, req: ILeaveRoomRequest): IEvent[] {
        return this._lobby.leaveRoom(socket, req.roomKey);
    }

    /**
     * Starts a new game in room of client if he is room owner
     * Informs client and other clients in room that a game has been started
     * @param {SocketIO.Socket} socket
     * @param {IStartGameRequest} req
     */
    public startGame(socket: Socket, req: IStartGameRequest): IEvent[] {
        const room = this._lobby.roomByKey(req.roomKey);
        if (!room) return [this._lobby.notInRoomEvent(socket)];
        return room.startGame(socket, req.sizeX, req.sizeY);
    }

    /**
     * Client places tile in his current room on given tile coordinates
     * Informs client and other clients in room that a tile has been placed
     * @param {SocketIO.Socket} socket
     * @param {IPlaceTileRequest} req
     */
    public placeTile(socket: Socket, req: IPlaceTileRequest): IEvent[] {
        const room = this._lobby.roomByKey(req.roomKey);
        if (!room) return; // Todo return invalid roomkey response
        return room.placeTile(socket, req.y, req.x);
    }

    public roomMessage(socket: Socket, req: IRoomMessageRequest): IEvent[] {
        const room = this._lobby.roomByKey(req.roomKey);
        if (!room) return; // Todo return invalid roomkey response
        return room.chatMessage(socket, req.message);
    }

    /**
     * Create a new Client and assign a name (one per connection)
     * @returns {IEvent}
     * @param socket
     * @param req
     */
    public registerClient(socket: Socket, req: IRegisterRequest): IEvent[] {
        console.log("new client");
        const key = Utility.getGUID();
        const newUser = new User(req.name, key);
        this._registeredNames.set(key, newUser);
        UserRepository.instance.save(newUser);
        console.log(key);
        console.log(req.name);
        console.log(this._registeredNames.get(key));
        const response =  {response: "registered", key} as IRegisteredResponse;
        const connectedEvent = {clients: [socket], name: "registered", response};
        return [connectedEvent];
    }

    public sendLobby(socket: SocketIO.Socket): IEvent[] {
        return [this._lobby.sendLobby(socket)];
    }

    public sendRoomStats(socket: Socket, req: IRoomStatsRequest): IEvent[] {
        return [StatsManager.sendRoomStats(socket, req, this._lobby.getRooms())];
    }

    public sendUserStats(socket: Socket, req: IUserStatsRequest): IEvent[] {
        return [StatsManager.sendUserStats(socket, req, this._registeredNames)];
    }

    public async sendGlobalStats(socket: Socket, req: IGlobalStatsRequest): Promise<IEvent[]> {
        return [await StatsManager.sendGlobalStats(socket, req)];
    }
}
