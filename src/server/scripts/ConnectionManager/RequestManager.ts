import {Socket} from "socket.io";
import SocketIO = require("socket.io");
import {IEvent} from "../Event";
import {ResponseEmitter} from "./ResponseEmitter";
import {SessionManager} from "./SessionManager";

export class RequestManager extends ResponseEmitter {

    private _io: SocketIO.Server;
    private _sessionManager: SessionManager;

    constructor( io: SocketIO.Server ) {
        super();
        this._io = io;
        this._sessionManager = new SessionManager();
    }

    /**
     * Server listens via socket.io to Client Requests
     * Requests get managed by ClientManager and Response gets returned
     * to client via extended ResponseEmitter
     * @constructor
     */
    public RequestListener() {
        this._io.on("connection", (socket: Socket) => {
            socket.on("register", (req: IRegisterRequest) => {
                this.emitEvents(this._sessionManager.registerClient(socket, req));
            });
            socket.on("roomList", () => {
                this.emitEvents(this._sessionManager.sendLobby(socket));
            });
            socket.on("joinRoom", (req: IJoinRoomRequest) => {
                this.emitEvents(this._sessionManager.joinRoom(socket, req));
            });
            socket.on("leaveRoom", (req: ILeaveRoomRequest) => {
                this.emitEvents(this._sessionManager.leaveRoom(socket, req));
            });
            socket.on("startGame", (req: IStartGameRequest) => {
                this.emitEvents(this._sessionManager.startGame(socket, req));
            });
            socket.on("placeTile", (req: IPlaceTileRequest) => {
                this.emitEvents(this._sessionManager.placeTile(socket, req));
            });
            socket.on("roomMessage", (req: IRoomMessageRequest) => {
                this.emitEvents(this._sessionManager.roomMessage(socket, req));
            });
        });

    }
}
