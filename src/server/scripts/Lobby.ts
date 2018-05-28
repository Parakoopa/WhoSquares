import {IEvent} from "../../Event";
import {Client} from "./Client";
import {Room} from "./Room";
import {Utility} from "./Utility";

export class Lobby {

    private _minimumClientsPerGame: number = 1;
    private readonly _rooms: Room[];
    private _maxRoomSize: number = 10;

    private _minGridSize: number = 3;
    private _maxGridSize: number = 10;

    constructor() {
        this._rooms = [];
    }
    /**
     * Tell all Clients to start GameManager
     * @constructor
     */
    public startGame(client: Client, sizeX: number, sizeY: number): IEvent[] {
        const room: Room = client.Room;
        if (room.Owner() === client ) {
            if (room.GetClients().length < this._minimumClientsPerGame) {
                // ToDo Add NotEnoughPlayer Reponse
                console.log("NotEnoughPlayer");
            }
            const sizes = this.adjustGameSize(sizeX, sizeY);
            sizeX = sizes[0];
            sizeY = sizes[1];

            room.createGame(sizeX, sizeY);
            const turnColor = client.color;

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
     *
     * @param {number} sizeX
     * @param {number} sizeY
     * @returns {number[]}
     */
    private adjustGameSize(sizeX: number, sizeY: number): number[] {
        if (sizeX > this._maxGridSize) sizeX = this._maxGridSize;
        if (sizeY > this._maxGridSize) sizeY = this._maxGridSize;
        if (sizeX < this._minGridSize) sizeX = this._minGridSize;
        if (sizeY < this._minGridSize) sizeY =  this._minGridSize;
        return [sizeX, sizeY];
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
        let room: Room = this.roomByName(req.roomName);
        if (room === null)room = this.createRoom(req.roomName);
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
    private createRoom(roomName: string): Room {
        const room: Room = new Room(roomName, Utility.getGUID(), this._maxRoomSize);
        this._rooms.push(room);
        return room;
    }

    /**
     * Return room based on its unique id (name)
     * @param {string} roomName
     * @returns {Room}
     * @constructor
     */
    private roomByName(roomName: string): Room {
        for (const room of this._rooms) {
            if (room.Name().toString() === roomName) return room;
        }
        return null;
    }

    /**
     * Return a room based on its key
     * @param {string} roomKey
     * @returns {Room}
     * @constructor
     */
    private roomByKey(roomKey: string): Room {
        for (const room of this._rooms) {
            if (room.key() === roomKey) return room;
        }
        return null;
    }

}
