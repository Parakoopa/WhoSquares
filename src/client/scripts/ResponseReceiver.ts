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
        // Actions
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
        this._socket.on("placedTile", (resp: IPlacedTileResponse) => {
            const color: number = parseInt(resp.playerColor, 16);
            this._gameMan.placedTile(resp.x, resp.y, color);
        });
        this._socket.on("startGame", (resp: IStartGameResponse) => {
            this._gameMan.startedGame(resp.sizeX, resp.sizeY);
        });
        // Game Events
        this._socket.on("winGame", (resp: IWinGameResponse) => {
            this._uiManager.winGame(resp.playerColor);
        });
        this._socket.on("informTurn", (resp: IInformTurnResponse) => {
            const color: number = parseInt(resp.turnColor, 16);
            this._uiManager.turnInfo(color);
        });

        // Error Feedback
        this._socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            this._uiManager.textElement(resp.response);
        });
        this._socket.on("notInRoom", () => {
            this._uiManager.textElement("You are not in a room!");
        });
        this._socket.on("notOwner", () => {
            this._uiManager.textElement("You are not the room owner!");
        });
    }

}
