import {Client} from "./Client/Client";
import {IEvent} from "./Event";
import {Room} from "./Room/Room";
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
        const room: Room = client.room;
        if (!room) return [this.notInRoomEvent(client)];
        if (room.Owner() !== client ) return [this.notOwnerEvent(client)];

        if (room.clients.length < this._minimumClientsPerGame) {
            // ToDo Add NotEnoughClients  Response
        }
        const sizes = this.adjustGameSize(sizeX, sizeY);
        sizeX = sizes[0];
        sizeY = sizes[1];

        room.createGame(sizeX, sizeY);

        const startEvent: IEvent = this.startEvent(room.clients, sizeX, sizeY);
        const informTurnEvent: IEvent = room.informTurnEvent(room.clients,  client.color);
        return [startEvent, informTurnEvent];
    }

    private startEvent(clients: Client[], sizeX: number, sizeY: number): IEvent {
        const startResponse =  {response: "startGame", sizeX, sizeY};
        return {clients, name: "startGame", response: startResponse};
    }

    private notInRoomEvent(client: Client): IEvent {
        return {clients: [client], name: "notInRoom", response: null};
    }

    private notOwnerEvent(client: Client): IEvent {
        return {clients: [client], name: "notOwner", response: null};
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
    public joinRoom(client: Client, req: IJoinRoomRequest): IEvent[] {
        let room: Room = this.roomByName(req.roomName);
        if (room === null)room = this.createRoom(req.roomName);
        else if (room.clients.length > room.maxSize) {
            const response: IRoomIsFullResponse = {response: "roomIsFull"};
            return [{clients: [client], name: "roomIsFull", response}];
        }

        if (room.containsClient(client)) return []; // ToDo tell client h already is in this room
        const joinedEvent: IEvent = this.joinedEvent(client, room);
        const otherJoinedEvent: IEvent = this.otherJoinedEvent(client); // This first as client is not in room yet
        return [joinedEvent, otherJoinedEvent];
    }

    private joinedEvent(client: Client, room: Room): IEvent {
        const response: IJoinedResponse = {
            response: "joinedRoom",
            roomName: room.name,
            roomKey: room.key,
            color: room.AddClient(client),
            otherPlayers: room.getPlayersExcept(client)};
        return{clients: [client], name: "joinedRoom", response};
    }

    private otherJoinedEvent(client: Client): IEvent {
        const response: IOtherJoinedResponse = {response: "otherJoinedRoom", otherPlayer: client.player};
        return {clients: client.room.getClientsExcept(client), name: "otherJoinedRoom", response};

    }

    public leaveRoom(client: Client, roomKey: string): IEvent[] {
        const room: Room = this.roomByKey(roomKey);
        if (room === null) return []; // ToDo notfiy client that room does not exist
        if (!room.RemoveClient(client)) return []; // ToDo Notify client that client is not in this room
        return this.leaveEvent(client, room);
    }

    private leaveEvent(client: Client, room: Room): IEvent[] {
        const leftResponse: ILeftResponse = {response: "leftRoom", roomKey: room.key};
        const leftEvent: IEvent = {clients: [client], name: "leftRoom", response: leftResponse};
        if (room.clients.length === 0) {
            this.removeRoom(room);
            return [leftEvent]; // no one else in room to notify
        }
        // There are still player in this room
        const otherLeftResponse: IOtherLeftResponse = {response: "otherLeftRoom",
            roomKey: room.key,
            name: client.name
        };
        const otherLeftEvent: IEvent = {clients: room.getClientsExcept(client), name: "otherLeftRoom", response: otherLeftResponse};
        return[leftEvent, otherLeftEvent];
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

    private removeRoom(room: Room): void {
        const index: number = this._rooms.indexOf(room);
        if (index < 0) return;
        this._rooms.splice(index, 1);
        console.log("roomCount:" + this._rooms.length);
    }

    /**
     * Return room based on its unique id (name)
     * @param {string} roomName
     * @returns {Room}
     * @constructor
     */
    private roomByName(roomName: string): Room {
        for (const room of this._rooms) {
            if (room.name.toString() === roomName) return room;
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
            if (room.key === roomKey) return room;
        }
        return null;
    }

}
