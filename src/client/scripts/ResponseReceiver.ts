import Socket = SocketIOClient.Socket;
import {GameManager} from "./GameManager";
import {UiManager} from "./UiManager";

export class ResponseReceiver {

    /**
     * Needs GameManagr to execute Server Responses
     * Needs UiManager to display error messages & Feedback that does nto influence game
     * Needs Socket to listen on for Responses(Responses are listed in /common directory)
     * @param {GameManager} _gameMan
     * @param {SocketIOClient.Socket} _socket
     * @param {UiManager} _uiManager
     */
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
            if (resp.response === "roomIsFull") { // todo make own socket.on
                this._uiManager.textElement(resp.response);
            } else this._gameMan.joinedRoom(resp);
        });
        this._socket.on("leftRoom", (resp: ILeftResponse) => {
            this._gameMan.leftRoom();
        });
        this._socket.on("otherLeftRoom", (resp: IOtherLeftResponse) => {
            this._gameMan.otherLeftRoom(resp.player);
        });
        this._socket.on("otherJoinedRoom", (resp: IOtherJoinedResponse) => {

            this._gameMan.otherJoinedRoom(resp.otherPlayer);
        });
        this._socket.on("placedTile", (resp: IPlacedTileResponse) => {
            this._gameMan.placedTile(resp.y, resp.x, resp.player);
        });
        this._socket.on("startGame", (resp: IStartGameResponse) => {
            this._gameMan.startedGame(resp.sizeX, resp.sizeY);
        });
        // Game Events
        this._socket.on("winGame", (resp: IWinGameResponse) => {
            this._uiManager.winGame(resp.player.name);
        });
        this._socket.on("informTurn", (resp: IInformTurnResponse) => {
            this._uiManager.turnInfo(resp.player.color);
        });

        // Error Feedback
        this._socket.on("observer", () => {
            this._uiManager.textElement("Observers to not play!");
        });
        this._socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            this._uiManager.textElement("It is not your turn!");
        });
        this._socket.on("notInRoom", () => {
            this._uiManager.textElement("You are not in a room!");
        });
        this._socket.on("alreadyInRoom", () => {
            this._uiManager.textElement("You are already in a room!");
        });
        this._socket.on("notOwner", () => {
            this._uiManager.textElement("You are not the room owner!");
        });
    }

}
