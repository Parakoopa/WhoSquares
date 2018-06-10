import {Socket} from "socket.io";
import {Room} from "../Room/Room";

/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
 */
export class Client  {

    private _rooms: Room[];

    /**
     * Clients are talked to via socket and identified via unique id guid
     * @param _socket
     * @param _key
     * @param _name
     */
    constructor(
        private _socket: Socket,
        private _key: string,
        private _name: string
    ) {
        this._rooms = [];
    }

    public get socket(): Socket {
        return this._socket;
    }

    public get key(): string {
        return this._key;
    }

    public get name(): string {
        return this._name;
    }

    public set name(val: string) {
        this._name = val;
    }

    public addRoom(room: Room): void {
        this._rooms.push(room);
    }

    public removeRoom(room: Room): void {
        const index = this._rooms.indexOf(room);
        if (index > -1) this._rooms.splice(index, 1);
    }

    public roomCount(): number {
        return this._rooms.length;
    }

}
