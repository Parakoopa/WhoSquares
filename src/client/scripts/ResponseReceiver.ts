import Socket = SocketIOClient.Socket;
import {GameManager} from "./GameManager";
import {LocalPlayer} from "./LocalPlayer";
import {OtherPlayer} from "./OtherPlayer";
import {Room} from "./Room";

export class ResponseReceiver {

    private _localPlayer: LocalPlayer;

    constructor(private _gameMan: GameManager, private _socket: Socket) {
        this.eventListener();
    }

    private eventListener() {
        // Initial Connection
        this._socket.on("connected", (resp: IConnectedResponse) => {
            this.addLocalPlayer(resp);
            this._gameMan.textElement(resp.response + ":\n" +  this._localPlayer.name);
        });
        // Join room
        this._socket.on("joinedRoom", (resp: IRoomIsFullResponse | IJoinedResponse) => {
            this.joinedRoom(resp);
        });
        this._socket.on("leftRoom", (resp: ILeftResponse) => {
            this._localPlayer.room.leftRoom(resp);
        });
        this._socket.on("otherLeftRoom", (resp: IOtherLeftResponse) => {
            this._localPlayer.room.otherLeftRoom(resp);
        });
        this._socket.on("otherJoinedRoom", (resp: IOtherJoinedResponse) => {
            this._localPlayer.room.otherJoinedRoom(resp);
        });
        // placedtile
        this._socket.on("placedTile", (resp: IPlacedTileResponse) => {
            this._localPlayer.room.placedTile(resp);
        });
        this._socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            this._gameMan.textElement(resp.response);
        });
        // Start GameManager
        this._socket.on("startGame", (resp: IStartGameResponse) => {
            this._localPlayer.room.startedGame(resp);
        });

        this._socket.on("informTurn", (resp: IInformTurnResponse) => {
            const color: number = parseInt(resp.turnColor, 16);
            this._gameMan.turnInfo(color);
        });
        this._socket.on("winGame", (resp: IWinGameResponse) => {
            this._gameMan.winGame(resp.playerColor);
        });
    }

    /**
     *
     * @param {IRoomIsFullResponse | IJoinedResponse} resp
     */
    private joinedRoom(resp: IRoomIsFullResponse | IJoinedResponse): void {
        if (resp.response === "joinedRoom") {
            const room: Room = new Room(
                this._localPlayer,
                resp.roomKey,
                resp.roomName,
                this._gameMan,
                this.toOtherPlayer(resp.otherPlayers
                ));
            this._localPlayer.color = resp.color;
            this._localPlayer.room = room;
        } else if (resp.response === "roomIsFull") {
            this._gameMan.textElement(resp.response);
        }
    }

    private addLocalPlayer(resp: IConnectedResponse): void {
        this._localPlayer = new LocalPlayer(resp.player, resp.key);
        this._gameMan.RequestEmitter(this._localPlayer);
    }

    private toOtherPlayer(players: IPlayer[]): OtherPlayer[] {
        const otherPlayers = []; // Reset on Join Room
        for (const player of players) {
            otherPlayers.push(new OtherPlayer(player));
        }
        return otherPlayers;
    }
}
