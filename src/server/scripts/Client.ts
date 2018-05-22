import {Socket} from "socket.io";
import {Room} from "./Room";

export class Client {

    private readonly _guid: string;
    private readonly _socket: Socket;
    private _room: Room;

    /**
     * Clients are talked to via socket and identified via unique id guid
     * @param {NodeJS.Socket} socket
     * @param {string} guid
     */
    constructor(socket: Socket, guid: string) {
        this._socket = socket;
        this._guid = guid;
    }

    public Socket(): Socket {
        return this._socket;
    }

    public Guid(): string {
        return this._guid;
    }

    get Room(): Room {
        return this._room;
    }

    set Room(value: Room) {
        this._room = value;
    }
}
