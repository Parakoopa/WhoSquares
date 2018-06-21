import {Socket} from "socket.io";
import SocketIO = require("socket.io");
import {Client} from "./Client/Client";
import {Player} from "./Client/Player/Player";
import {IEvent} from "./Event";
import {Lobby} from "./Lobby/Lobby";
import {Utility} from "./Utility";

export class ConnectionManager {

    private _io: SocketIO.Server;
    private readonly _clients: Client[];
    private _lobby: Lobby;
    private connectionCounter: number = 100;

    constructor( io: SocketIO.Server ) {
        this._lobby = new Lobby();
        this._clients = [];
        this._io = io;
    }

    /**
     * Server listens via socket.io to Client Requests
     * @constructor
     */
    public EventListener() {
        this._io.on("connection", (socket: Socket) => {
            this.connect(socket);

            socket.on("disconnect", () => {
                this.disconnect(socket);
            });
            socket.on("joinRoom", (req: IJoinRoomRequest) => {
               this.joinRoom(socket, req);
            });
            socket.on("leaveRoom", (req: ILeaveRoomRequest) => {
                this.leaveRoom(socket, req);
            });
            socket.on("startGame", (req: IStartGameRequest) => {
                this.startGame(socket, req);
            });
            socket.on("placeTile", (req: IPlaceTileRequest) => {
                this.placeTile(socket, req);
            });
        });

    }

    /**
     * (Reconnects if valid secret-key is given)
     * Initial Connection of Client
     * Create new Client on Server and send connectionEvent to requesting Client
     * @param {SocketIO.Socket} socket
     */
    private connect(socket: Socket): void {
        const key = socket.handshake.headers.key;
        const newClient = this.clientByKey(key);
        console.log("private key of connected client: " + key);
        if (!newClient) {
            const connectionEvent: IEvent = this.addClient(socket);
            this.emitEvent(connectionEvent);
        } else {
            newClient.socket = socket;
            const reconnectionEvents: IEvent[] = this.reconnectClient(newClient);
            this.emitEvents(reconnectionEvents);
        }
    }

    /**
     * Disconnects client after a certain amount of time
     * @param {SocketIO.Socket} socket
     */
    private disconnect(socket: Socket): void {
        // ToDo Add Timer to allow reconnecting for limited time span
        // this.removeClient(socket);
    }

    /**
     * Add Client to room if he is not yet in a room
     * Informs client and other clients in room that he joined
     * @param {SocketIO.Socket} socket
     * @param {IJoinRoomRequest} req
     */
    private joinRoom(socket: Socket, req: IJoinRoomRequest){
        const client = this.isValidClient(socket);
        if (!client) return;
        if (client.room) { // leave existing room
            const response: IAlreadyInRoomResponse = {response: "alreadyInRoom"};
            const event = {clients: [client], name: "alreadyInRoom", response};
            this.emitEvent(event); // ToDo maybe make SwitchRoomResponse to be safe
            return;
        }
        const joinEvents: IEvent[] = this._lobby.joinRoom(client, req);
        this.emitEvents(joinEvents);
    }

    /**
     * Remove Client from room
     * Informs client and other clients in room that he left
     * @param {SocketIO.Socket} socket
     * @param {ILeaveRoomRequest} req
     */
    private leaveRoom(socket: Socket, req: ILeaveRoomRequest): void {
        const client = this.isValidClient(socket);
        if (!client) return;
        const leftEvents: IEvent[] = this._lobby.leaveRoom(client, req.roomKey);
        this.emitEvents(leftEvents);
    }

    /**
     * Starts a new game in room of client if he is room owner
     * Informs client and other clients in room that a game has been started
     * @param {SocketIO.Socket} socket
     * @param {IStartGameRequest} req
     */
    private startGame(socket: Socket, req: IStartGameRequest): void {
        const client = this.isValidClient(socket);
        if (!client) return;
        const room = this._lobby.roomByKey(req.roomKey);
        const startEvents: IEvent[] = this._lobby.startGame(client, room, req.sizeX, req.sizeY);
        this.emitEvents(startEvents);
    }

    /**
     * Client places tile in his current room on given tile coordinates
     * Informs client and other clients in room that a tile has been placed
     * @param {SocketIO.Socket} socket
     * @param {IPlaceTileRequest} req
     */
    private placeTile(socket: Socket, req: IPlaceTileRequest): void {
        const client = this.isValidClient(socket);
        if (!client) return;
        const room = this._lobby.roomByKey(req.roomKey);
        if (!room) return; // Todo return invalid roomkey response
        const placeEvents: IEvent[] =  room.placeTile(client, req.y, req.x);
        this.emitEvents(placeEvents);
    }

    /**
     * Sends an refreshEvent to the client if the socket does not represent a client
     * (This happens by opening a new window or being disconnected for too long)
     * @param {SocketIO.Socket} socket
     * @returns {Client}
     */
    private isValidClient(socket: Socket): Client {
        const client: Client = this.clientBySocket(socket);
        if (!client) socket.emit("refresh", {response: "refresh"});
        return client;
    }

    /**
     * Emits a Response to all clients listed in IEvent
     * @param {IEvent} event
     */
    private emitEvent(event: IEvent): void {
        console.log("Emitted to Players: " + event.name + " to: " + event.clients);
        for (let i = 0; i < event.clients.length; i++) {
            event.clients[i].socket.emit(event.name, event.response);
        }
    }

    /**
     * Emits Multiple Events made of Responses to multiple Players
     * @param {IEvent[]} events
     */
    private emitEvents(events: IEvent[]): void {
        for (let i = 0; i < events.length; i++) {
            this.emitEvent(events[i]);
        }
    }

    /**
     * Create a new Client (Limited to one per browser (local storage))
     * @returns {IEvent}
     * @param socket
     */
    private addClient(socket: Socket): IEvent {
        const key = Utility.getGUID();
        const player: IPlayer = new Player("" + this.connectionCounter++);
        const client: Client = new Client(socket, key, key); // Todo make key -> name
        this._clients.push(client);
        const response =  {response: "connected", player, key} as IConnectedResponse;
        return {clients: [client], name: "connected", response};
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
        if (!room) return [reconnectionEvent];
        return[reconnectionEvent, ...room.reconnectClient(client)];

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
