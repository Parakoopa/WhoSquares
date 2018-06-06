import Socket = SocketIOClient.Socket;
import {GameManager} from "./GameManager";
import {OtherPlayer} from "./OtherPlayer";

export class ResponseReceiver {

    private _playerKey: string;
    private _roomName: string;
    private _roomKey: string;
    private _otherPlayers: OtherPlayer[];

    constructor(private _gameMan: GameManager, private _socket: Socket) {
        this.eventListener();
    }

    private eventListener() {
        // Initial Connection
        this._socket.on("connected", (resp: IConnectedResponse) => {
            this._playerKey = resp.playerKey;
            this._gameMan.textElement(resp.response + ":\n" +  resp.playerKey);
        });
        // Join room
        this._socket.on("joinedRoom", (resp: IRoomIsFullResponse | IJoinedResponse) => {
            this.joinedRoom(resp);
        });
        this._socket.on("leftRoom", (resp: ILeftResponse) => {
            this.leftRoom(resp);
        });
        this._socket.on("otherLeftRoom", (resp: IOtherLeftResponse) => {
            this.otherLeftRoom(resp);
        });
        this._socket.on("otherJoinedRoom", (resp: IOtherJoinedResponse) => {
            this.otherJoinedRoom(resp);
        });
        // placedtile
        this._socket.on("placedTile", (resp: IPlacedTileResponse) => {
            this.placedTile(resp);
        });
        this._socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            this._gameMan.textElement(resp.response);
        });
        // Start GameManager
        this._socket.on("startGame", (resp: IStartGameResponse) => {
            this.startedGame(resp);
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
            this._roomName = resp.roomName;
            this._roomKey = resp.roomKey;
            this._gameMan.color(parseInt(resp.color, 16));
            this._gameMan.textElement("you joined as: " + resp.color + " in:" + resp.roomKey);
            this._gameMan.roomName(resp.roomName);
            this.addPlayers(resp.otherPlayers);
        } else if (resp.response === "roomIsFull") {
            this._gameMan.textElement(resp.response);
        }
    }

    private leftRoom(resp: ILeftResponse): void {
            this._roomName = null;
            this._roomKey = null;
            // ToDo reset color: this._gameMan.color(parseInt(resp.color, 16));
            this._gameMan.textElement("left room");
            this._gameMan.roomName("left room");
            this._gameMan.destroyGrid();
            this.resetPlayers();
    }

    private otherLeftRoom(resp: IOtherLeftResponse): void {
        const player: OtherPlayer = this.playerByName(resp.name);
        this.removePlayer(player);
    }

    private otherJoinedRoom(resp: IOtherJoinedResponse): void {
        const player: OtherPlayer = new OtherPlayer(resp.otherPlayer);
        this.addPlayer(player);
    }

    private playerByName(playerName: string): OtherPlayer {
        for (const player of this._otherPlayers) {
            if (player.name === playerName) return player;
        }
        return null;
    }
    private addPlayers(players: IPlayer[]): void {
        this._otherPlayers = []; // Reset on Join Room
        for (const player of players) {
            this._otherPlayers.push(new OtherPlayer(player));
        }
        this.updateRoomList();
    }

    private addPlayer(player: OtherPlayer): void {
        this._otherPlayers.push(player);
        this.updateRoomList();
    }

    private removePlayer(player: OtherPlayer): void {
        const index: number = this._otherPlayers.indexOf(player);
        if (index > -1) this._otherPlayers.splice(index, 1);
        this.updateRoomList();
    }

    private resetPlayers(): void {
        this._otherPlayers = [];
        this.updateRoomList();
    }

    private updateRoomList(): void {
        let roomList: string = "";
        for (const player of this._otherPlayers) {
            roomList += player.name + "\n";
        }
        this._gameMan.roomList(roomList);

    }

    private placedTile(resp: IPlacedTileResponse): void {
        const color: number = parseInt(resp.playerColor, 16);
        this._gameMan.placedTile(color, resp.x, resp.y);
        this._gameMan.textElement(resp.response);
    }

    private startedGame(resp: IStartGameResponse) {
        this._gameMan.createGrid(resp.sizeX, resp.sizeY);
        const textMessage: string = resp.response;
        this._gameMan.textElement(textMessage);
    }
}
