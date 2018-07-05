import {Socket} from "socket.io";
import SocketIO = require("socket.io");
import {Client} from "../Client/Client";
import {Player} from "../Client/Player/Player";
import {IEvent} from "../Event";
import {Lobby} from "../Lobby/Lobby";
import {Utility} from "../Utility";

/**
 * Used to manage client requests
 * Every Request returns one or several responses
 * packaged as an IEvent[]
 */
export class ClientManager {

    private readonly _clients: Client[];
    private _lobby: Lobby;
    private connectionCounter: number = 100;

    constructor() {
        this._lobby = new Lobby();
        this._clients = [];
    }

    /**
     * (Reconnects if valid secret-key is given)
     * Initial Connection of Client
     * Create new Client on Server and send connectionEvent to requesting Client
     * @param {SocketIO.Socket} socket
     */
    public connect(socket: Socket): IEvent[] {
        const key = socket.handshake.headers.key;
        const newClient = this.clientByKey(key);
        console.log("private key of connected client: " + key);
        if (!newClient) {
            return this.addClient(socket);
        } else {
            newClient.socket = socket;
            return this.reconnectClient(newClient);
        }
    }

    /**
     * Disconnects client after a certain amount of time
     * @param {SocketIO.Socket} socket
     */
    public disconnect(socket: Socket): IEvent[] {
        // ToDo Add Timer to allow reconnecting for limited time span
        // this.removeClient(socket);
        return [];
    }

    /**
     * Returnn IUserNameResponse with IPlayer and asssigned name
     * if name is available otherwise send INameUnavailableResponse
     */
    public setUserName(socket: Socket, req: IUserNameRequest): IEvent[] {
        const client = this.isValidClient(socket);
        if (!client) return;
        if (this.isAvailableName(req.playerName)) {
            client.player = new Player(req.playerName, null, true);
            const response: IUserNameResponse = {player: client.player};
            const usernameEvent = {clients: [client], name: "userName", response};
            const joinLobbyEvent = this._lobby.joinLobby(client);
            return [usernameEvent, joinLobbyEvent];
        }
        return [{clients: [client], name: "nameUnavailable", response: {}}];
    }

    /**
     * Add Client to room if he is not yet in a room
     * Informs client and other clients in room that he joined
     * @param {SocketIO.Socket} socket
     * @param {IJoinRoomRequest} req
     */
    public joinRoom(socket: Socket, req: IJoinRoomRequest): IEvent[]{
        const client = this.isValidClient(socket);
        if (!client) return;
        return this._lobby.joinRoom(client, req);
    }

    /**
     * Remove Client from room
     * Informs client and other clients in room that he left
     * @param {SocketIO.Socket} socket
     * @param {ILeaveRoomRequest} req
     */
    public leaveRoom(socket: Socket, req: ILeaveRoomRequest): IEvent[] {
        const client = this.isValidClient(socket);
        if (!client) return;
        return this._lobby.leaveRoom(client, req.roomKey);
    }

    /**
     * Starts a new game in room of client if he is room owner
     * Informs client and other clients in room that a game has been started
     * @param {SocketIO.Socket} socket
     * @param {IStartGameRequest} req
     */
    public startGame(socket: Socket, req: IStartGameRequest): IEvent[] {
        const client = this.isValidClient(socket);
        if (!client) return;
        const room = this._lobby.roomByKey(req.roomKey);
        return this._lobby.startGame(client, room, req.sizeX, req.sizeY);
    }

    /**
     * Client places tile in his current room on given tile coordinates
     * Informs client and other clients in room that a tile has been placed
     * @param {SocketIO.Socket} socket
     * @param {IPlaceTileRequest} req
     */
    public placeTile(socket: Socket, req: IPlaceTileRequest): IEvent[] {
        const client = this.isValidClient(socket);
        if (!client) return;
        const room = this._lobby.roomByKey(req.roomKey);
        if (!room) return; // Todo return invalid roomkey response
        return room.placeTile(client, req.y, req.x);
    }

    public roomMessage(socket: Socket, req: IRoomMessageRequest): IEvent[] {
        const client = this.isValidClient(socket);
        if (!client) return;
        const room = this._lobby.roomByKey(req.roomKey);
        if (!room) return; // Todo return invalid roomkey response
        return room.chatMessage(client, req.message);
    }

    private isAvailableName(name: string): boolean {
       for (const client of this._clients) {
           if (client.player.name === name) return false;
       }
       return true;
    }

    /**
     * Sends an refreshEvent to the client if the socket does not represent a client
     * (This happens by opening a new window or being disconnected for too long)
     * @param {SocketIO.Socket} socket
     * @returns {Client}
     */
    private isValidClient(socket: Socket): Client {
        const client: Client = this.clientBySocket(socket);
        if (!client) socket.emit("refresh", {response: {}});
        return client;
    }
    
    /**
     * Create a new Client (Limited to one per browser (local storage))
     * @returns {IEvent}
     * @param socket
     */
    private addClient(socket: Socket): IEvent[] {
        const key = Utility.getGUID();
        const client: Client = new Client(socket, key, key); // Todo make key -> name
        this._clients.push(client);
        const response =  {response: "connected", key} as IConnectedResponse;
        const connectedEvent = {clients: [client], name: "connected", response};
        return [connectedEvent];
    }

    /**
     * A who-squares-private-key has been sent by the client
     * so the player has to be informed that he has reconnected
     * @returns {}
     * @param client
     */
    private reconnectClient(client: Client): IEvent[] {
        // ToDo Replace with a stored name that has been set by the player
        const player: IPlayer = new Player("" + this.connectionCounter++);
        const response =  {response: "connected", player, key: client.key} as IConnectedResponse;
        const reconnectionEvent: IEvent = {clients: [client], name: "connected", response};
        const room = client.room;
        if (!room) {
            const joinLobbyEvent = this._lobby.joinLobby(client);
            console.log("no room");
            return [reconnectionEvent, joinLobbyEvent];
        }
        return [reconnectionEvent, ...room.reconnectClient(client)];
    }

    /**
     * Removes Player from List of connected players
     * @param {SocketIO.Socket} socket
     * @constructor
     */
    private removeClient(socket: Socket): void {
        const client: Client = this.clientBySocket(socket);
        const index: number = this._clients.indexOf(client);
        if (index > -1) this._clients.splice(index, 1);
    }

    /**
     * Return player of this specific socket
     * @param {SocketIO.Socket} socket
     * @returns {Player}
     * @constructor
     */
    private clientBySocket(socket: Socket): Client {
        for (const client of this._clients) {
            if (client.socket === socket) return client;
        }
        return null;
    }

    /**
     * Return Player based on key
     * @param {string} key
     * @returns {Player}
     * @constructor
     */
    private clientByKey(key: string): Client {
        console.log(this._clients.length);
        for (const client of this._clients) {
            console.log(client.key + " === " + key);
            if (client.key === key) return client;
        }
        return null;
    }

}
