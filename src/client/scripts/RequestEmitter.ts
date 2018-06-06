import Socket = SocketIOClient.Socket;
import {GameManager} from "./GameManager";

export class RequestEmitter {

    private _socket: Socket;
    private _gameMan: GameManager;
    private _playerKey: string;
    private _roomKey: string;

    constructor(game: GameManager, socket: Socket) {
        this._socket = socket;
        this._gameMan = game;
    }

    public joinRoom(roomName: string): void {
        const playerKey = this._playerKey;
        this._socket.emit("joinRoom", {request: "joinRoom", playerKey, roomName});
    }

    public leaveRoom(): void {
        const playerKey = this._playerKey;
        const roomKey = this._roomKey;
        this._socket.emit("leaveRoom", {request: "leaveRoom", playerKey, roomKey});
    }

    public startGame(sizeX: number, sizeY: number): void {
        const playerKey = this._roomKey;
        const roomKey = this._roomKey;
        this._socket.emit("startGame", {request: "startGame", playerKey, roomKey, sizeX, sizeY});
    }

    public placeTile(x: number, y: number): void {
        const playerKey = this._playerKey;
        const roomKey = this._roomKey;
        this._socket.emit("placeTile" , {request: "placeTile", playerKey, roomKey, x, y});
    }

}
