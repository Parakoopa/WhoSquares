import {Socket} from "socket.io";
import {Room} from "./Room";

export class Player implements IPlayer {

    private _color: string;
    private _room: Room;
    private _mission: IMission;

    /**
     * Players are talked to via socket and identified via unique id guid
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

    public get key(): string {
        return this._key;
    }

    public get name(): string {
        return this._name;
    }

    public set name(val: string) {
        this._name = val;
    }

    public get color(): string {
        return this._color;
    }

    public set color(val: string) {
        this._color = val;
    }

    public get room(): Room {
        return this._room;
    }

    public set room(val: Room) {
        this._room = val;
    }

    public get mission(): IMission {
        return this._mission;
    }

    public set mission(val: IMission) {
        this._mission = val;
    }

}
