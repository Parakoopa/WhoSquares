import {Socket} from "socket.io";
import SocketIO = require("socket.io");
import {IEvent} from "../Event";
import {Lobby} from "../Lobby/Lobby";
import {Utility} from "../Utility";

/**
 * Used to manage login/room list/register etc. requests
 * Every Request returns one or several responses
 * packaged as an IEvent[]
 */
export class SessionManager {

    private _lobby: Lobby;
    private _registeredNames: Map<string, string>; // Secretkey -> Name // TODO: Datenbank

    constructor() {
        this._lobby = new Lobby();
    }

    /**
     * Add Client to room if he is not yet in a room
     * Informs client and other clients in room that he joined
     * @param {SocketIO.Socket} socket
     * @param {IJoinRoomRequest} req
     */
    public joinRoom(socket: Socket, req: IJoinRoomRequest): IEvent[] {
        const playerName = this._registeredNames.get(req.playerKey);
        if (!playerName) return [this._lobby.nameNotRegisteredEvent(socket)];
        return this._lobby.joinRoom(socket, req, playerName);
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
        this._registeredNames.set(key, req.name);
        const response =  {response: "registered", key} as IRegisteredResponse;
        const connectedEvent = {clients: [socket], name: "registered", response};
        return [connectedEvent];
    }

    public sendLobby(socket: SocketIO.Socket): IEvent[] {
        return [this._lobby.sendLobby(socket)];
    }
}
