import {Socket} from "socket.io";
import {Client} from "./Client";
import {Lobby} from "./Lobby";
import {Utility} from "./Utility";
import {IEvent} from "./Event";

export class ConnectionManager {

    private _io: SocketIO.Server;
    private readonly _clients: Client[];
    private _lobby: Lobby;

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
            const connectionEvent: IEvent = this.addClient(new Client(socket, Utility.getGUID()));
            this.emitEvent(connectionEvent);

            // Disconnect
            socket.on("disconnect", () => {
                this.removeClient(socket);
            });

            // Client requests to join specific room
            socket.on("joinRoom", (req: IJoinRoomRequest) => {
                const joinEvent: IEvent = this._lobby.joinRoom(this.clientBySocket(socket), req);
                this.emitEvent(joinEvent);
            });

            // Client requests to join specific room
            socket.on("leftRoom", (req: ILeaveRoomRequest) => {
                const leftEvent: IEvent = this._lobby.leftRoom(this.clientBySocket(socket), req);
                this.emitEvent(leftEvent);
            });

            // Start Game, create Grid, inform Clients
            socket.on("startGame", (req: IStartGameRequest) => {
                const client: Client = this.clientBySocket(socket);
                const startEvents: IEvent[] = this._lobby.startGame(client, req.sizeX, req.sizeY);
                this.emitEvents(startEvents);
            });

            // A player colors a certain tile
            socket.on("placeTile", (req: IPlaceTileRequest) => {
                const client: Client = this.clientBySocket(socket);
                const placeEvents: IEvent[] =  client.getRoom().placeTile(client, req.x, req.y);
                this.emitEvents(placeEvents);
            });

        });

    }

    /**
     * Emits a Response to all clients listed in IEvent
     * @param {IEvent} event
     */
    private emitEvent(event: IEvent): void {
        console.log("Emitted to Clients: " + event.name);
        for (let i = 0; i < event.clients.length; i++) {
            event.clients[i].getSocket().emit(event.name, event.response);
        }
    }

    /**
     * Emits Multiple Events made of Responses to multiple Clients
     * @param {IEvent[]} events
     */
    private emitEvents(events: IEvent[]): void {
        for (let i = 0; i < events.length; i++) {
            this.emitEvent(events[i]);
        }
    }

    /**
     * Save
     * @param {Client} client
     * @returns {IEvent}
     */
    private addClient(client: Client): IEvent {
        this._clients.push(client);
        const response =  {response: "connected", clientKey: client.getKey()} as IConnectedResponse;
        return {clients: [client], name: "connected", response};
    }

    /**
     * Removes Client from List of connected clients
     * @param {SocketIO.Socket} socket
     * @constructor
     */
    private removeClient(socket: Socket): void {
        const client: Client = this.clientBySocket(socket);
        const index: number = this._clients.indexOf(client);
        if (index > -1) this._clients.splice(index, 1);
    }

    /**
     * Return client of this specific socket
     * @param {SocketIO.Socket} socket
     * @returns {Client}
     * @constructor
     */
    private clientBySocket(socket: Socket): Client {
        for (const client of this._clients) {
            if (client.getSocket() === socket) return client;
        }
        return null;
    }

    /**
     * Return Client based on key
     * @param {string} key
     * @returns {Client}
     * @constructor
     */
    private clientByKey(key: string): Client {
        for (const client of this._clients) {
            if (client.getKey() === key) return client;
        }
        return null;
    }

}
