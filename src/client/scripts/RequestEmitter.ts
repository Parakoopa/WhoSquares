import Socket = SocketIOClient.Socket;
import {LocalPlayer} from "./LocalPlayer";

export class RequestEmitter {

    constructor(private _socket: Socket, private _localPlayer: LocalPlayer = null) {}

    public joinRoom(roomName: string): void {
        const playerKey = this._localPlayer.key;
        this._socket.emit("joinRoom", {request: "joinRoom", playerKey, roomName});
    }

    public leaveRoom(): void {
        if (!this._localPlayer.room) return;
        const playerKey = this._localPlayer.key;
        const roomKey = this._localPlayer.room.key;
        this._socket.emit("leaveRoom", {request: "leaveRoom", playerKey, roomKey});
    }

    public startGame(sizeX: number, sizeY: number): void {
        const playerKey = this._localPlayer.key;
        if (!this._localPlayer.room) { // ToDo replace with uiManager message instead of redundantly asking server
             this._socket.emit("startGame", {request: "startGame", playerKey, roomKey: null, sizeX, sizeY});
             return;
         }
        const roomKey = this._localPlayer.room.key;
        this._socket.emit("startGame", {request: "startGame", playerKey, roomKey, sizeX, sizeY});
    }

    public placeTile(x: number, y: number): void {
        const playerKey = this._localPlayer.key;
        const roomKey = this._localPlayer.room.key;
        this._socket.emit("placeTile" , {request: "placeTile", playerKey, roomKey, x, y});
    }

}
