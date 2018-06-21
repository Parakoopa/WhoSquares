import {Socket} from "socket.io";
import {Room} from "../Room/Room";

/**
 * A Client consists of a socket which Responses get send to
 * A Client has a secret key to reconnect, a name and a room.
 */
export class Client  {

    // ToDo limit user to one room
    private _room: Room;

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
    ) {}

    public get socket(): Socket {
        return this._socket;
    }

    public set socket(val: Socket) {
        this._socket = val;
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

    public get room(): Room {
        return this._room;
    }

    public set room(val: Room) {
        this._room = val;
    }

}
