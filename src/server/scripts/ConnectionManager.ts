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
                guid: newClient.Guid(),
                values: {}
            } as IConnectionResponse);

            // Disconnect
            socket.on("disconnect", () => {
                this.RemoveClient(socket);
            });

            // Client requests to join specific room
            socket.on("joinRoom", (data) => { // ToDo Find out which type data has
                const resp = this.JoinRoom(this.ClientBySocket(socket), data);
                socket.emit("joinRoom", resp);
            });

            // Start Game
            socket.on("startGame", () => {
                const client: Client = this.ClientBySocket(socket);
                const room: Room = client.Room;
                console.log("sdfonsdkjbfs");
                if (room.Owner() === client ) {
                    this.StartGame(room.GetClients());
                }
            });
        });

    }

    /**
     * Tell all Clients to start Game
     * @constructor
     */
    private StartGame(clients: Client[]) {
        for (const client of clients) {
            client.Socket().emit("startGame", {response: "Game has been started"});
        }
    }

    /**
     * Create Room if necessary
     * Return responses: RoomIsFull or JoinedRoom + clientCount
     * @param {Client} client
     * @param {string} roomName
     * @returns {string}
     * @constructor
     */
    private JoinRoom(client: Client, roomName: string): IJoinedReponse | IRoomIsFullResponse {
        let room: Room = this.RoomByName(roomName);
        if (room == null)room = this.CreateRoom();
        else if (room.GetClients.length > room.Size()) {
            return {
                response: "roomIsFull"
            };
        }

        if (!room.ContainsClient(client)) {
            const color: string = room.AddClient(client);
            return {
                response: "joinedRoom",
                clientCount: room.GetClients().length,
                color: color
            };
        }
    }

    /**
     * Create room with unique id
     * @returns {Room}
     * @constructor
     */
    private CreateRoom(): Room {
        const room: Room = new Room(this.GetGUID().toString(), this._maxRoomSize);
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
            if (room.Name() === roomName) return room;
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

    /**
     * Generate Unique Identifier
     * @returns {string}
     * @constructor
     */
    private GetGUID() {
        // src: https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }

}
