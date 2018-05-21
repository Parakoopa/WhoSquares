import {Socket} from "socket.io";

export class Client {

    private readonly _guid: string;
    private readonly _socket: Socket;

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
}
