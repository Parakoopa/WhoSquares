import Socket = SocketIOClient.Socket;
import {Utility} from "../Utility";

export class RequestEmitter {

    /**
     * Sends Requests to Server (Inputs from InputManager f.e.)
     * @param {SocketIOClient.Socket} _socket
     */
    constructor(private _socket: Socket) {}

    /**
     * Send IUserNameRequest to try to rserve given name for this client/player
     * @param {string} playerName
     */
    public setUserName(playerName: string): void {
        const playerKey = Utility.getLocalPlayer().key;
        this._socket.emit("userName", {playerKey, playerName});
    }

    /**
     * Send JoinRoomRequest to join a specific room by Name
     * @param {string} roomName
     */
    public joinRoom(roomName: string): void {
        console.log("send joinRoom");
        const playerKey = Utility.getLocalPlayer().key;
        this._socket.emit("joinRoom", {playerKey, roomName});
    }

    /**
     * Send LeaveRoomRequest to leave a specific room by its key
     */
    public leaveRoom(): void {
        if (!Utility.getLocalPlayer().room) return;
        const playerKey = Utility.getLocalPlayer().key;
        const roomKey = Utility.getLocalPlayer().room.key;
        this._socket.emit("leaveRoom", {playerKey, roomKey});
    }

    /**
     * Send StartGameRequest with given grid sizes for a specific room by key
     * Requests are listed in /common directory
     * @param {number} sizeX
     * @param {number} sizeY
     */
    public startGame(sizeX: number, sizeY: number): void {
        const playerKey = Utility.getLocalPlayer().key;
        if (!Utility.getLocalPlayer().room) { // ToDo replace with uiManager message instead of redundantly asking server?
             this._socket.emit("startGame", {playerKey, roomKey: null, sizeX, sizeY});
             return;
         }
        const roomKey = Utility.getLocalPlayer().room.key;
        this._socket.emit("startGame", {playerKey, roomKey, sizeX, sizeY});
    }

    /**
     * Send PlaceTileRequest on given x,y coordinates by in a specific room by key
     * @param {number} x
     * @param {number} y
     */
    public placeTile(y: number, x: number): void {
        const playerKey = Utility.getLocalPlayer().key;
        const roomKey = Utility.getLocalPlayer().room.key;
        this._socket.emit("placeTile" , {playerKey, roomKey, y, x});
    }

    public roomMessage(message: string): void {
        const playerKey = Utility.getLocalPlayer().key;
        const roomKey = Utility.getLocalPlayer().room.key;
        this._socket.emit("roomMessage" , {playerKey, roomKey, message});
    }

}
