import {Socket} from "socket.io";
import {IEvent} from "../../Event";
import {Client} from "./Client";
import {Lobby} from "./Lobby";

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
            const connectionEvent: IEvent = this.addClient(new Client(socket, this.GetGUID()));
            this.emitEvent(connectionEvent);

            // Disconnect
            socket.on("disconnect", () => {
                this.RemoveClient(socket);
            });

            // Client requests to join specific room
            socket.on("joinRoom", (req: IJoinRoomRequest) => {
                const joinEvent: IEvent = this._lobby.joinRoom(this.ClientBySocket(socket), req);
                this.emitEvent(joinEvent);
            });

            // Start Game, create Grid, inform Clients
            socket.on("startGame", (req: IStartGameRequest) => {
                const client: Client = this.ClientBySocket(socket);
                const startEvents: IEvent[] = this._lobby.startGame(client, req.sizeX, req.sizeY);
                this.emitEvents(startEvents);
            });

            socket.on("placeTile", (req: IPlaceTileRequest) => {
                const client: Client = this.ClientBySocket(socket);
                const placeEvents: IEvent[] =  this._lobby.placeTile(client, req.x, req.y);
                this.emitEvents(placeEvents);
            });

        });

    }

    private emitEvent(event: IEvent): void {
        console.log("Emitted to Clients: " + event.name);
        for (let i = 0; i < event.clients.length; i++) {
            event.clients[i].Socket().emit(event.name, ...event.args);
        }
    }

    private emitEvents(events: IEvent[]): void {
        for (let i = 0; i < events.length; i++) {
            this.emitEvent(events[i]);
        }
    }

    private addClient(client: Client): IEvent {
        this._clients.push(client);
        const args =  {response: "connected", clientKey: client.key()} as IConnectedResponse;
        return {clients: [client], name: "connected", args};
    }

    /**
     * Removes Client from List of connected clients
     * @param {SocketIO.Socket} socket
     * @constructor
     */
    private RemoveClient(socket: Socket): void {
        const client: Client = this.ClientBySocket(socket);
        const index: number = this._clients.indexOf(client);
        if (index > -1) this._clients.splice(index, 1);
    }

    /**
     * Return client of this specific socket
     * @param {SocketIO.Socket} socket
     * @returns {Client}
     * @constructor
     */
    private ClientBySocket(socket: Socket): Client {
        for (const client of this._clients) {
            if (client.Socket() === socket) return client;
        }
        return null;
    }

    private ClientByKey(key: string): Client {
        for (const client of this._clients) {
            if (client.key() === key) return client;
        }
        return null;
    }

    /**
     * Generate Unique Identifier
     * @returns {string}
     * @constructor
     */
    private GetGUID(): string {
        // src: https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }

}
