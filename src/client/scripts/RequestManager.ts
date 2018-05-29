import {GameManager} from "./GameManager";
import Socket = SocketIOClient.Socket;

export class RequestManager {

    private _socket: Socket;
    private _gameMan: GameManager;
    private _clientKey: string;
    private _roomKey: string;

    constructor(game: GameManager) {
        this._socket = io();
        this._gameMan = game;
    }

    public eventListener() {
        // Initial Connection
        this._socket.on("connected", (resp: IConnectedResponse) => {
            this._clientKey = resp.clientKey;
            this._gameMan.textElement(resp.response + ":\n" +  resp.clientKey);
        });
        // Join room
        this._socket.on("joinedRoom", (resp: IRoomIsFullResponse | IJoinedResponse) => {
            if (resp.response === "joinedRoom") {
                this._roomKey = resp.roomKey;
                const clientCount: number = resp.clientCount;
                this._gameMan.color(parseInt(resp.color, 16));
                this._gameMan.textElement(resp.response + ": color: " + resp.color + ", clients: " + clientCount);
            } else if (resp.response === "roomIsFull") {
                this._gameMan.textElement(resp.response);
            }
        });
        // placedtile
        this._socket.on("placedTile", (resp: IPlacedTileResponse) => {
            const color: number = parseInt(resp.clientColor, 16);
            this._gameMan.placedTile(color, resp.x, resp.y);
            this._gameMan.textElement(resp.response);
        });
        this._socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            this._gameMan.textElement(resp.response);
        });
        // Start GameManager
        this._socket.on("startGame", (resp: IStartGameResponse) => {
            this._gameMan.createGrid(resp.sizeX, resp.sizeY);

            const textMessage: string = resp.response;
            this._gameMan.textElement(textMessage);
        });

        this._socket.on("informTurn", (resp: IInformTurnResponse) => {
            const color: number = parseInt(resp.turnColor, 16);
            this._gameMan.turnInfo(color);
        });
        this._socket.on("winGame", (resp: IWinGameResponse) => {
            this._gameMan.winGame(resp.clientColor);
        });
    }

    public joinRoom(roomName: string): void {
        const clientKey = this._roomKey;
        this._socket.emit("joinRoom", {request: "joinRoom", clientKey, roomName});
    }

    public startGame(sizeX: number, sizeY: number): void {
        const clientKey = this._roomKey;
        const roomKey = this._roomKey;
        this._socket.emit("startGame", {request: "startGame", clientKey, roomKey, sizeX, sizeY});
    }

    public placeTile(x: number, y: number): void {
        const clientKey = this._clientKey;
        const roomKey = this._roomKey;
        this._socket.emit("placeTile" , {request: "placeTile", clientKey, roomKey, x, y});
    }

}
