import Socket = SocketIOClient.Socket;
import {GameManager} from "./GameManager";
import {UiManager} from "./UiManager";

export class ResponseReceiver {


    constructor(private _gameMan: GameManager, private _socket: Socket, private _uiManager: UiManager) {
        this.eventListener();
    }

    private eventListener() {
        // Initial Connection
        this._socket.on("connected", (resp: IConnectedResponse) => {
            this._gameMan.addLocalPlayer(resp.player, resp.key);
        });
        // Join room
        this._socket.on("joinedRoom", (resp: IRoomIsFullResponse | IJoinedResponse) => {
            this._gameMan.joinedRoom(resp);
        });
        this._socket.on("leftRoom", (resp: ILeftResponse) => {
            this._gameMan.leftRoom();
        });
        this._socket.on("otherLeftRoom", (resp: IOtherLeftResponse) => {
            this._gameMan.otherLeftRoom(resp.name);
        });
        this._socket.on("otherJoinedRoom", (resp: IOtherJoinedResponse) => {
            this._gameMan.otherJoinedRoom(resp.otherPlayer);
        });
        // placedtile
        this._socket.on("placedTile", (resp: IPlacedTileResponse) => {
            const color: number = parseInt(resp.playerColor, 16);
            this._gameMan.placedTile(resp.x, resp.y, color);
        });

        this._socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            this._uiManager.textElement(resp.response);
        });
        // Start GameManager
        this._socket.on("startGame", (resp: IStartGameResponse) => {
            this._gameMan.startedGame(resp.sizeX, resp.sizeY);
        });
        this._socket.on("informTurn", (resp: IInformTurnResponse) => {
            const color: number = parseInt(resp.turnColor, 16);
            console.log(color);
            this._uiManager.turnInfo(color);
        });
        this._socket.on("winGame", (resp: IWinGameResponse) => {
            this._uiManager.winGame(resp.playerColor);
        });
    }

}
