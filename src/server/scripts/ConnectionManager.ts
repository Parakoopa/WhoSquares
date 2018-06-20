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
            const key = socket.handshake.headers.key;
            const client = this.clientByKey(key);
            console.log("private key of connected client: " + key);
            //console.log(client);
            if (!client) {
                console.log("adding client");
                const connectionEvent: IEvent = this.addClient(socket);
                console.log("After adding client: " + this._clients.length);
                this.emitEvent(connectionEvent);
            } else {
                console.log("reconnecting");
                client.socket = socket;
                const reconnectionEvents: IEvent[] = this.reconnectClient(client);
                this.emitEvents(reconnectionEvents);
            }

            // Disconnect
            socket.on("disconnect", () => {
                //ToDo Add Timer to allow reconnecting for limited time span
                //this.removeClient(socket);
            });

            // Client requests to join specific room
            socket.on("joinRoom", (req: IJoinRoomRequest) => {
                const client: Client = this.clientBySocket(socket);
                if(!client) return; // ToDo client does not exist yet or no longer so recreate client
                if (client.room) { // leave existing room
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
                const placeEvents: IEvent[] =  room.placeTile(client, req.y, req.x);
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
