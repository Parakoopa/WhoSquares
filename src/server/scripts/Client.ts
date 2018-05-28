import {Socket} from "socket.io";
import {Mission} from "./Missions/Mission";
import {Room} from "./Room";

export class Client {

    private readonly _key: string;
    private readonly _socket: Socket;
    private _room: Room;
    private _color: string;
    private _mission: Mission;

    /**
     * Clients are talked to via socket and identified via unique id guid
     * @param {NodeJS.Socket} socket
     * @param key
     */
    constructor(socket: Socket, key: string) {
        this._socket = socket;
        this._key = key;
    }

    public Socket(): Socket {
        return this._socket;
    }

    public key(): string {
        return this._key;
    }

    get Room(): Room {
        return this._room;
    }

    set Room(value: Room) {
        this._room = value;
    }

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }

    get mission(): Mission {
        return this._mission;
    }

    set mission(value: Mission) {
        this._mission = value;
    }

}
