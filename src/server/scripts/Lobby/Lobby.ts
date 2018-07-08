import {Socket} from "socket.io";
import {IEvent} from "../Event";
import {Room} from "../Room/Room";
import {RoomRepository} from "../Room/RoomRepository";
import {User} from "../User/User";
import {Utility} from "../Utility";
import {LobbyEvents} from "./LobbyEvents";

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
        // Asynchronously load all rooms that are stored in the database
        RoomRepository.instance.getAll().then((rooms) => {
            rooms.forEach((room) => {
                this._rooms.push(room);
            });
        });
        // Register server shutdown
        this.registerServerShutdown();
    }

    public sendLobby(client: Socket): IEvent {
        return this.roomListEvent(client, this._rooms);
    }

    /**
     * Create Room if it does not yet exist
     * Return RoomIsFullEvent if room is full
     * Otherwise tell room to add client
     * @param socket
     * @param req
     * @param user
     * @returns {string}
     * @constructor
     */
    public joinRoom(socket: Socket, req: IJoinRoomRequest, user: User): IEvent[] {
        let room: Room = this.roomByName(req.roomName);
        if (room === null) {
            room = this.createRoom(req.roomName);
        }
        // If the room has ended, it can't be joined or left
        if (room.hasEnded()) return [this.roomHasEndedEvent(socket, room.name)];
        // Check if player already exists
        const existingPlayer = room.players.getPlayerByPlayerKey(user.key);
        if (existingPlayer) {
            // Reconnect
            return room.reconnectClient(socket, existingPlayer);
        } else {
            // Join!
            if (room.size() > room.maxSize) {
                return [this.roomIsFullEvent(socket, room.name)];
            }
            return room.AddClient(socket, user);
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
        // If the room has ended, it can't be joined or left
        if (room.hasEnded()) return [this.roomHasEndedEvent(client, room.name)];
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
        // Delete this room from the DB
        RoomRepository.instance.delete(room);
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

    /**
     * If the server shuts down, write all rooms to the database before.
     */
    private registerServerShutdown() {
        const shutdownFunction = (async () => {
            const promises: Array<Promise<any>> = [];
            console.log("[Lobby] Server shutting down... saving rooms.");
            this._rooms.forEach((room) => {
                // Don't save games that haven't started to the db
                if (room.hasStarted()) {
                    promises.push(RoomRepository.instance.save(room));
                }
            });
            await Promise.all(promises);
            console.log("[Lobby] Done!");
            process.exit(0);
        });
        process.on("SIGTERM", shutdownFunction);
        process.on("SIGINT", shutdownFunction);
    }
}
