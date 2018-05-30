import {Socket} from "socket.io";
import {Room} from "./Room";

export class Client implements IClient {

    private readonly _socket: Socket;
    private readonly _key: string;
    private _name: string;
    private _room: Room;
    private _color: string;
    private _mission: IMission;

    /**
     * Clients are talked to via socket and identified via unique id guid
     * @param {NodeJS.Socket} socket
     * @param key
     */
    constructor(socket: Socket, key: string) {
        this._socket = socket;
        this._key = key;
    }

    public getSocket(): Socket {
        return this._socket;
    }

    public getKey(): string {
        return this._key;
    }

    public getName(): string {
        return this._name;
    }

    public setName(val: string): void {
    }

    public getRoom(): Room {
        return this._room;
    }

    public setRoom(val: Room) {
        this._room = val;
    }

    public getColor(): string {
        return this._color;
    }

    public setColor(val: string): void {
        this._color = val;
    }

    public getMission(): IMission {
        return this._mission;
    }

    public setMission(val: IMission): void {
        this._mission = val;
    }

}
