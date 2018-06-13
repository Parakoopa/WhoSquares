import {Client} from "../Client/Client";
import {LocalPlayer} from "../Client/LocalPlayer";
import {IEvent} from "../Event";
import {Room} from "../Room/Room";
import {Utility} from "../Utility";

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
    public startGame(client: Client, room: Room, sizeX: number, sizeY: number): IEvent[] {
        if (!room) return [this.notInRoomEvent(client)];
        if (room.Owner() !== client ) return [this.notOwnerEvent(client, room.name)];

        if (room.clients.length < this._minimumClientsPerGame) {
            // ToDo Add NotEnoughClients  Response
        }
        const sizes = this.adjustGameSize(sizeX, sizeY);
        sizeX = sizes[0];
        sizeY = sizes[1];

        room.createGame(sizeX, sizeY);

        const startEvent: IEvent = this.startEvent(room.clients, sizeX, sizeY);
        const informTurnEvent: IEvent = room.informTurnEvent();
        return [startEvent, informTurnEvent];
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
        if (room === null) room = this.createRoom(req.roomName);
        else if (room.clients.length > room.maxSize) {
            return [this.roomIsFullEvent(client, room.name)];
        }
        return room.AddClient(client);
    }

    public leaveRoom(client: Client, roomKey: string): IEvent[] {
        const room: Room = this.roomByKey(roomKey);
        if (room === null) return []; // ToDo notfiy client that room does not exist
        if (!room.RemoveClient(client)) return []; // ToDo Notify client that client is not in this room
        client.removeRoom(room);
        const leftEvent: IEvent = this.leftEvent(client, room);
        if (room.isEmpty()) this.removeRoom(room);
        const otherLeftEvent: IEvent = this.otherLeftEvent(client, room);
        return [leftEvent, otherLeftEvent];
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
    public roomByKey(roomKey: string): Room {
        for (const room of this._rooms) {
            if (room.key === roomKey) return room;
        }
        return null;
    }

    // EVENTS
    private roomIsFullEvent(client: Client, roomName: string): IEvent {
        const response: IRoomIsFullResponse = {response: "roomIsFull", roomName};
        return {clients: [client], name: "roomIsFull", response};
    }

    private notOwnerEvent(client: Client, roomName: string): IEvent {
        const response: INotOwnerResponse = {response: "notOwner", roomName};
        return {clients: [client], name: "notOwner", response};
    }

    private notInRoomEvent(client: Client): IEvent {
        const response: INotInRoomResponse = {response: "notInRoom"};
        return {clients: [client], name: "notInRoom", response};
    }

    private startEvent(clients: Client[], sizeX: number, sizeY: number): IEvent {
        const startResponse: IStartGameResponse = {response: "startGame", sizeX, sizeY};
        return {clients, name: "startGame", response: startResponse};
    }

    private leftEvent(client: Client, room: Room): IEvent {
        const leftResponse: ILeftResponse = {response: "leftRoom", roomKey: room.key};
        return {clients: [client], name: "leftRoom", response: leftResponse}; // no one else in room to notify
    }

    private otherLeftEvent(client: Client, room: Room): IEvent {
        const otherLeftResponse: IOtherLeftResponse = {response: "otherLeftRoom",
            roomKey: room.key,
            name: client.name
        };
        return {
            clients: room.getClientsExcept(client),
            name: "otherLeftRoom",
            response: otherLeftResponse
        };
    }

}
