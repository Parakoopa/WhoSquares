import {Room} from "../Room/Room";
import {Socket} from "socket.io";


/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
 */
export class Client implements IPlayer {

    private _room: Room;
    private _mission: IMission;

    /**
     * Clients are talked to via socket and identified via unique id guid
     * @param _socket
     * @param _key
     * @param _player
     */
    constructor(
        private _socket: Socket,
        private _key: string,
        private _player: IPlayer
    ) {}

    public get socket(): Socket {
        return this._socket;
    }

    public get key(): string {
        return this._key;
    }

    public get player(): IPlayer {
        return this._player;
    }

    public get name(): string {
        return this._player.name;
    }

    public set name(val: string) {
        this._player.name = val;
    }

    public get color(): string {
        return this._player.color;
    }

    public set color(val: string) {
        this._player.color = val;
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
