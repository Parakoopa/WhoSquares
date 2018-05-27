import {IEvent} from "../../Event";
import {Client} from "./Client";
import {Room} from "./Room";

export class Lobby {

    private _minimumClientsPerGame: number = 2;
    private readonly _rooms: Room[];
    private _maxRoomSize: number = 10;

    constructor(){
        this._rooms = [];
    }
    /**
     * Tell all Clients to start GameManager
     * @constructor
     */
    public startGame(client: Client, sizeX: number, sizeY: number): IEvent[] {
        const room: Room = client.Room;
        if (room.Owner() === client ) {
            // ToDo Rework size adjustment
            if (sizeX > 10) sizeX = 10;
            if (sizeY > 10) sizeY = 10;
            if (sizeX < 3) sizeX = 3;
            if (sizeY < 3) sizeY = 3;
            room.createGame(sizeX, sizeY);
            const turnColor = room.turnClient();

            const clients = room.GetClients();
            const startArgs: IStartGameResponse =  {response: "startGame", sizeX, sizeY};
            const startEvent: IEvent = {clients, name: "startGame", args: startArgs};

            const informArgs: IInformTurnResponse =   {response: "informTurn", turnColor};
            const informEvent: IEvent = {clients, name: "informTurn", args: informArgs};

            return [startEvent, informEvent];
        } else {
            const notOwnerArgs = {response: "notOwner"};
            const informEvent: IEvent = {clients: [client], name: "startGame", args: notOwnerArgs};
            return [informEvent];
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
    public joinRoom(client: Client, req: IJoinRoomRequest): IEvent {
        let room: Room = this.RoomByName(req.roomName);
        if (room === null)room = this.CreateRoom(req.roomName);
        else if (room.GetClients.length > room.Size()) {
            const args: IRoomIsFullResponse = {response: "roomIsFull"};
            return {clients: [client], name: "roomIsFull", args};
        }

        if (!room.ContainsClient(client)) {
            const args: IJoinedResponse = {response: "joinedRoom",
                roomKey: room.key(),
                clientCount: room.GetClients().length,
                color: room.AddClient(client)};
            return {clients: [client], name: "joinedRoom", args};
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

    public placeTile(client: Client, x: number, y: number): IEvent[] {
        return client.Room.placeTile(client, x, y);
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
     * MOVE INTO SOME NEW UTILITY CLASS
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
