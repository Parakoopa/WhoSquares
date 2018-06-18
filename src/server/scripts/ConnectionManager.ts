import {Socket} from "socket.io";
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
     * Add all Listening Events here
     * @constructor
     */
    public EventListener() {
        this._io.on("connection", (socket: Socket) => {
            const connectionEvent: IEvent = this.addClient(socket);
            this.emitEvent(connectionEvent);

            // Disconnect
            socket.on("disconnect", () => {
                this.removeClient(socket);
            });

            // Client requests to join specific room
            socket.on("joinRoom", (req: IJoinRoomRequest) => {
                const client: Client = this.clientBySocket(socket);

                if (client.roomCount() > 0) { // leave existing room
                    const response: IAlreadyInRoomResponse = {response: "alreadyInRoom"};
                    const event = {clients: [client], name: "alreadyInRoom", response};
                    this.emitEvent(event); // ToDo maybe make SwitchRoomResponse to be safe
                    return;
                }
                const joinEvents: IEvent[] = this._lobby.joinRoom(client, req);
                this.emitEvents(joinEvents);
            });

            // Player requests to join specific room
            socket.on("leaveRoom", (req: ILeaveRoomRequest) => {
                const leftEvents: IEvent[] = this._lobby.leaveRoom(this.clientBySocket(socket), req.roomKey);
                this.emitEvents(leftEvents);
            });

            // Start Game, create Grid, inform Players
            socket.on("startGame", (req: IStartGameRequest) => {
                const client: Client = this.clientBySocket(socket);
                const room = this._lobby.roomByKey(req.roomKey);
                const startEvents: IEvent[] = this._lobby.startGame(client, room, req.sizeX, req.sizeY);
                this.emitEvents(startEvents);
            });

            // A client colors a certain tile
            socket.on("placeTile", (req: IPlaceTileRequest) => {
                const client: Client = this.clientBySocket(socket);
                const room = this._lobby.roomByKey(req.roomKey);
                if (!room) return; // Todo return invalid roomkey response
                const placeEvents: IEvent[] =  room.placeTile(client, req.x, req.y);
                this.emitEvents(placeEvents);
            });

        });

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
     * Save
     * @returns {IEvent}
     * @param socket
     */
    private addClient(socket: Socket): IEvent {
        const key = Utility.getGUID();
        const player: IPlayer = new Player("" + this.connectionCounter++);
        const client: Client = new Client(socket, key, key); //Todo make key -> name
        this._clients.push(client);
        const response =  {response: "connected", player, key} as IConnectedResponse;
        return {clients: [client], name: "connected", response};
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
        for (const client of this._clients) {
            if (client.key === key) return client;
        }
        return null;
    }

}
