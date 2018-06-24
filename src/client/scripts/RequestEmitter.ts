import Socket = SocketIOClient.Socket;
import {LocalPlayer} from "./LocalPlayer";

export class RequestEmitter {

    /**
     * Sends Requests to Server (Inputs from InputManager f.e.)
     * @param {SocketIOClient.Socket} _socket
     * @param {LocalPlayer} _localPlayer
     */
    constructor(private _socket: Socket, private _localPlayer: LocalPlayer) {}

    /**
     * Send JoinRoomRequest to join a specific room by Name
     * @param {string} roomName
     */
    public joinRoom(roomName: string): void {
        const playerKey = this._localPlayer.key;
        this._socket.emit("joinRoom", {playerKey, roomName});
    }

    /**
     * Send LeaveRoomRequest to leave a specific room by its key
     */
    public leaveRoom(): void {
        if (!this._localPlayer.room) return;
        const playerKey = this._localPlayer.key;
        const roomKey = this._localPlayer.room.key;
        this._socket.emit("leaveRoom", {playerKey, roomKey});
    }

    /**
     * Send StartGameRequest with given grid sizes for a specific room by key
     * //ToDo check in some other class beforehand if room is empty to avoid sending empty roomkey
     * Requests are listed in /common directory
     * @param {number} sizeX
     * @param {number} sizeY
     */
    public startGame(sizeX: number, sizeY: number): void {
        const playerKey = this._localPlayer.key;
        if (!this._localPlayer.room) { // ToDo replace with uiManager message instead of redundantly asking server?
             this._socket.emit("startGame", {playerKey, roomKey: null, sizeX, sizeY});
             return;
         }
        const roomKey = this._localPlayer.room.key;
        this._socket.emit("startGame", {playerKey, roomKey, sizeX, sizeY});
    }

    /**
     * Send PlaceTileRequest on given x,y coordinates by in a specific room by key
     * @param {number} x
     * @param {number} y
     */
    public placeTile(y: number, x: number): void {
        const playerKey = this._localPlayer.key;
        const roomKey = this._localPlayer.room.key;
        this._socket.emit("placeTile" , {playerKey, roomKey, y, x});
    }

}
