import {IEvent} from "../Event";
import {Room} from "../Room/Room";
import {Utility} from "../Utility";
import {LobbyEvents} from "./LobbyEvents";
import {Socket} from "socket.io";

/**
 * Initializes Lobby and sets base values for rooms/
 * ToDo make given values room specific via input fields being fillable by client
 */
export class Lobby extends LobbyEvents {

    private readonly _rooms: Room[];
    private _minimumClientsPerGame: number = 1; // TODO: Use!
    private _maxRoomSize: number = 10;

    constructor() {
        super();
        this._rooms = [];
    }

    private roomNames(): string[] {
        const names: string[] = [];
        for (const room of this._rooms) {
            names.push(room.name);
        }
        return names;
    }

    public sendLobby(client: Socket): IEvent {
        return this.roomListEvent(client, this.roomNames());
    }

    /**
     * Create Room if it does not yet exist
     * Return RoomIsFullEvent if room is full
     * Otherwise tell room to add client
     * @param socket
     * @param req
     * @param playerName
     * @returns {string}
     * @constructor
     */
    public joinRoom(socket: Socket, req: IJoinRoomRequest, playerName: string): IEvent[] {
        let room: Room = this.roomByName(req.roomName);
        if (room === null) {
            room = this.createRoom(req.roomName);
        }
        // Check if player already exists
        const existingPlayer = room.getPlayerByKey(req.playerKey);
        if (existingPlayer) {
            // Reconnect
            return room.reconnectClient(socket, existingPlayer);
        } else {
            // Join!
            if (room.size() > room.maxSize) {
                return [this.roomIsFullEvent(socket, room.name)];
            }
            return room.AddClient(socket, req.playerKey, playerName);
        }
    }

    /**
     * Remove Client from room & room from client
     * Remove room if room is empty now
     * Tell client & other clients that given player left
     * @param {Client} client
     * @param {string} roomKey
     * @returns {IEvent[]}
     */
    public leaveRoom(client: Socket, roomKey: string): IEvent[] {
        const room: Room = this.roomByKey(roomKey);
        if (room === null) return []; // ToDo notfiy client that room does not exist
        const events = room.removeClient(client);
        if (room.isEmpty()) this.removeRoom(room);
        return events;
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
