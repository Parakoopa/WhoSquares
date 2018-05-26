import {Socket} from "socket.io";
import {Client} from "./Client";
import {Room} from "./Room";

export class ConnectionManager {

    private _io: SocketIO.Server;
    private readonly _clients: Client[];
    private _minimumClientsPerGame: number = 2;
    private readonly _rooms: Room[];
    private _maxRoomSize: number = 10;

    constructor( io: SocketIO.Server ) {
        this._clients = [];
        this._rooms = [];
        this._io = io;
    }

    /**
     * Add all Listening Events here
     * @constructor
     */
    public EventListener() {
        this._io.on("connection", (socket: Socket) => {
            const newClient: Client = new Client(socket, this.GetGUID());
            this._clients.push(newClient);
            socket.emit("connection", {
                response: "connected",
                clientKey: newClient.key(),
                values: {}
            } as IConnectionResponse);

            // Disconnect
            socket.on("disconnect", () => {
                this.RemoveClient(socket);
            });

            // Client requests to join specific room
            socket.on("joinRoom", (req: IJoinRoomRequest) => {
                const resp = this.JoinRoom(this.ClientBySocket(socket), req);
                socket.emit("joinRoom", resp);
            });

            // Start Game, create Grid, inform Clients
            socket.on("startGame", (req: IStartGameRequest) => {
                const client: Client = this.ClientBySocket(socket);
                const room: Room = client.Room;
                if (room.Owner() === client ) {
                    this.StartGame(room.GetClients(), room, req.sizeX, req.sizeY);
                } else {
                    socket.emit("notOwner", {response: "notOwner"});
                }
            });

            socket.on("placeTile", (req: IPlaceTileRequest) => {
                this.placeTile(this.RoomByKey(req.roomKey), this.ClientByKey(req.clientKey), req.x, req.y);
                const room: Room = this.RoomByKey(req.roomKey);
                const event: IEvent = room.placeTile(this.ClientByKey(req.clientKey), req.x, req.y);
                socket.emit(event.name, ...event.args);
            });

        });

    }

    private placeTile(room: Room, client: Client, x: number, y: number ): void {
        const event: IEvent = room.placeTile(client, x, y);
        if (event.name === "notYourTurn") {
            client.Socket().emit(event.name, ...event.args);
        } else {
            for (client of room.GetClients()) {
                client.Socket().emit(event.name, event.args);
            }
        }
    }

    /**
     * Tell all Clients to start GameManager
     * @constructor
     */
    private StartGame(clients: Client[], room: Room, sizeX: number, sizeY: number) {
        // ToDo Rework size adjustment
        if (sizeX > 10) sizeX = 10;
        if (sizeY > 10) sizeY = 10;
        if (sizeX <  3) sizeX =  3;
        if (sizeY <  3) sizeY =  3;
        room.createGame(sizeX, sizeY);
        const turnColor = room.turnClient();
        for (const client of clients) {
            client.Socket().emit("startGame", {response: "startGame", sizeX, sizeY});
            client.Socket().emit("informTurn", {response: "informTurn", turnColor});
        }
    }

    /**
     * Create Room if necessary
     * Return responses: RoomIsFull or JoinedRoom + clientCount
     * @param {Client} client
     * @param req
     * @returns {string}
     * @constructor
     */
    private JoinRoom(client: Client, req: IJoinRoomRequest): IJoinedResponse | IRoomIsFullResponse {
        let room: Room = this.RoomByName(req.roomName);
        if (room === null)room = this.CreateRoom(req.roomName);
        else if (room.GetClients.length > room.Size()) {
            return {
                response: "roomIsFull"
            };
        }

        if (!room.ContainsClient(client)) {
            const color: string = room.AddClient(client);
            return {
                response: "joinedRoom",
                roomKey: room.key(),
                clientCount: room.GetClients().length,
                color
            };
        }
    }

    /**
     * Create room with unique id
     * @returns {Room}
     * @constructor
     */
    private CreateRoom(roomName: string): Room {
        const room: Room = new Room(roomName, this.GetGUID(), this._maxRoomSize);
        this._rooms.push(room);
        return room;
    }

    /**
     * Return room based on its unique id (name)
     * @param {string} roomName
     * @returns {Room}
     * @constructor
     */
    private RoomByName(roomName: string): Room {
        for (const room of this._rooms) {
            if (room.Name().toString() === roomName) return room;
        }
        return null;
    }

    private RoomByKey(roomKey: string): Room {
        for (const room of this._rooms) {
            if (room.key() === roomKey) return room;
        }
        return null;
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
