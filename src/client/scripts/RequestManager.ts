import {GameManager} from "./GameManager";
import Socket = SocketIOClient.Socket;

export class RequestManager {

    private _socket: Socket;
    private _game: GameManager;
    private _clientKey: string;
    private _roomKey: string;

    constructor(game: GameManager) {
        this._socket = io();
        this._game = game;
    }

    public EventListener() {
        // Initial Connection
        this._socket.on("connected", (resp: IConnectedResponse) => {
            this._clientKey = resp.clientKey;
            this._game.TextElement(resp.response + ":\n" +  resp.clientKey);
        });
        // Join room
        this._socket.on("joinRoom", (resp: IRoomIsFullResponse | IJoinedResponse) => {
            if (resp.response === "joinedRoom") {
                this._roomKey = resp.roomKey;
                const clientCount: number = resp.clientCount;
                this._game.color(parseInt(resp.color, 16));
                this._game.TextElement(resp.response + ": color: " + resp.color + ", clients: " + clientCount);
            } else if (resp.response === "roomIsFull") {
                this._game.TextElement(resp.response);
            }
        });
        // placedtile
        this._socket.on("placedTile", (resp: IPlacedTileResponse) => {
            const color: number = parseInt(resp.clientColor, 16);
            this._game.placedTile(color, resp.x, resp.y);
            this._game.TextElement(resp.response);
        });
        this._socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            this._game.TextElement(resp.response);
        });
        // Start GameManager
        this._socket.on("startGame", (resp: IStartGameResponse) => {
            this._game.createGrid(resp.sizeX, resp.sizeY);

            const textMessage: string = resp.response;
            this._game.TextElement(textMessage);
        });

        this._socket.on("informTurn", (resp: IinformTurnResponse) => {
            const color: number = parseInt(resp.turnColor, 16);
            this._game.turnInfo(color);
        });
    }

    public JoinRoom(roomName: string): void {
        const clientKey = this._roomKey;
        this._socket.emit("joinRoom", {request: "joinRoom", clientKey, roomName});
    }

    public StartGame(sizeX: number, sizeY: number): void {
        const clientKey = this._roomKey;
        const roomKey = this._roomKey;
        this._socket.emit("startGame", {request: "startGame", clientKey, roomKey, sizeX, sizeY});
    }

    public PlaceTile(x: number, y: number): void {
        const clientKey = this._clientKey;
        const roomKey = this._roomKey;
        this._socket.emit("placeTile" , {request: "placeTile", clientKey, roomKey, x, y});
    }

}
