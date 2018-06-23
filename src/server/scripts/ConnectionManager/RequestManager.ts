import {Socket} from "socket.io";
import SocketIO = require("socket.io");
import {Client} from "../Client/Client";
import {Player} from "../Client/Player/Player";
import {IEvent} from "../Event";
import {Lobby} from "../Lobby/Lobby";
import {Utility} from "../Utility";
import {ClientManager} from "./ClientManager";
import {ResponseEmitter} from "./ResponseEmitter";

export class RequestManager extends ResponseEmitter {

    private _io: SocketIO.Server;
    private _clientManager: ClientManager;

    constructor( io: SocketIO.Server ) {
        super();
        this._io = io;
        this._clientManager = new ClientManager();
    }

    /**
     * Server listens via socket.io to Client Requests
     * Requests get managed by ClientManager and Response gets returned
     * to client via extended ResponseEmitter
     * @constructor
     */
    public RequestListener() {
        this._io.on("connection", (socket: Socket) => {
            this.emitEvents(this._clientManager.connect(socket));

            socket.on("disconnect", () => {
                this.emitEvents(this._clientManager.disconnect(socket));
            });
            socket.on("joinRoom", (req: IJoinRoomRequest) => {
                this.emitEvents(this._clientManager.joinRoom(socket, req));
            });
            socket.on("leaveRoom", (req: ILeaveRoomRequest) => {
                this.emitEvents(this._clientManager.leaveRoom(socket, req));
            });
            socket.on("startGame", (req: IStartGameRequest) => {
                this.emitEvents(this._clientManager.startGame(socket, req));
            });
            socket.on("placeTile", (req: IPlaceTileRequest) => {
                this.emitEvents(this._clientManager.placeTile(socket, req));
            });
        });

    }
}
