import {Client} from "../Client/Client";
import {IEvent} from "../Event";
import {Room} from "../Room/Room";
import {Utility} from "../Utility";
import {LobbyEvents} from "./LobbyEvents";

/**
 * Initializes Lobby and sets base values for rooms/
 * ToDo make given values room specific via input fields being fillable by client
 */
export class Lobby extends LobbyEvents {

    private readonly _rooms: Room[];
    private _minimumClientsPerGame: number = 1;
    private _maxRoomSize: number = 10;
    private _minGridSize: number = 3;
    private _maxGridSize: number = 10;

    constructor() {
        super();
        this._rooms = [];
    }

    /**
     * Return NotInRoomEvent if client is not in room
     * Return NotOwnerEvent if requesting client is not room owner
     * Return NotEnoughClientsEvent if room lacks players
     * Tells room to create a game
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

        return room.createGame(sizeX, sizeY);
    }

    /**
     * Readjusts grid sizes to be inside minimum-maximum range
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
     * Create Room if it does not yet exist
     * Return RoomIsFullEvent if room is full
     * Otherwise tell room to add client
     * @param {Client} client
     * @param req
     * @returns {string}
     * @constructor
     */
    public joinRoom(client: Client, req: IJoinRoomRequest): IEvent[] {
        if (client.room) { // leave existing room
            return [this.alreadyInRoomEvent(client)]; // ToDo maybe make SwitchRoomResponse to be safe
        }
        let room: Room = this.roomByName(req.roomName);
        if (room === null) room = this.createRoom(req.roomName);
        else if (room.clients.length > room.maxSize) {
            return [this.roomIsFullEvent(client, room.name)];
        }
        return room.AddClient(client);
    }

    /**
     * Remove Client from room & room from client
     * Remove room if room is empty now
     * Tell client & other clients that given player left
     * @param {Client} client
     * @param {string} roomKey
     * @returns {IEvent[]}
     */
    public leaveRoom(client: Client, roomKey: string): IEvent[] {
        const room: Room = this.roomByKey(roomKey);
        if (room === null) return []; // ToDo notfiy client that room does not exist
        const player = room.removeClient(client);
        if (!player) return []; // ToDo Notify client that client is not in this room
        client.room = null;

        // ToDo move into RoomEvents and call from Room?
        const leftEvent: IEvent = this.leftEvent(client, room.name);
        const otherLeftEvent: IEvent = this.otherLeftEvent(room.getClientsExcept(client), room.name, player);

        if (room.isEmpty()) this.removeRoom(room);
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

    /**
     * Remove a room
     * @param {Room} room
     */
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

}
