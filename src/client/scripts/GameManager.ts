import Game = Phaser.Game;
import {LocalPlayer} from "./LocalPlayer";
import {ResponseReceiver} from "./ResponseReceiver";
import {UiManager} from "./UiManager";
import {Grid} from "./Grid";

export class GameManager {

    private _game: Game;
    private _socket: SocketIOClient.Socket;
    private _uiManager: UiManager;
    private _responseReceiver: ResponseReceiver;
    private _localPlayer: LocalPlayer;

    constructor() {

        const self = this;
        const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
            preload() {
              self.centerGame(game);
              self.loadImages(game);
              self._uiManager = new UiManager(game);
              console.log(self._uiManager);
            },
            create() {
                self._uiManager.createUi();
                self._game = game;
                self._socket = io();
                self._responseReceiver = new ResponseReceiver(self, self._socket, self._uiManager);
            },
            update() {
                self._uiManager.update();
            }
        });
    }

    /**
     *
     * @param {Phaser.Game} game
     */
    private centerGame(game: Game): void {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.refresh();
    }

    /**
     *
     * @param {Phaser.Game} game
     */
    private loadImages(game: Game): void {
        game.load.image("gridTile", "./img/square32_grey.png");
        game.load.image("startButton", "./img/startButton.png");
        game.load.image("joinRoom01", "./img/joinRoom01.png");
        game.load.image("joinRoom02", "./img/joinRoom02.png");
        game.load.image("leaveRoom", "./img/leaveRoom.png");

    }

    public addLocalPlayer(player: IPlayer, key: string): void {
        this._localPlayer = new LocalPlayer(player, key);
        this._uiManager.inputManager.createRequestEmitter(this._socket, this._localPlayer);
        this._uiManager.textElement("LocalPlayer: " +  this._localPlayer.name);
    }

    public joinedRoom(resp: IRoomIsFullResponse | IJoinedResponse) {
        if(this._localPlayer.room) {
            this._uiManager.textElement("You are already in a room. Leave first!");
        }
        else if (resp.response === "roomIsFull") {
            this._uiManager.textElement(resp.response);
        } else {
            this._localPlayer.joinedRoom(resp);
            // If game already started, recreate grid
            if (resp.gridInfo) {
                console.log("color: " + this._localPlayer.color);
                const grid: Grid = this._uiManager.createGridByInfo(resp.gridInfo, this._localPlayer.color);
                this._localPlayer.room.startedGame(grid);
            }
            this._uiManager.textElement("joined Room - Color: " + resp.color);
            this._uiManager.roomName(resp.roomName);
        }
        this.updateRoomList();
    }

    public leftRoom(): void {
        this._localPlayer.leftRoom();
        this._uiManager.textElement("left room");
        this._uiManager.roomName("left room");
        this.updateRoomList();
    }

    public otherJoinedRoom(otherPlayer: IPlayer): void {
        this._localPlayer.room.otherJoinedRoom(otherPlayer);
        this.updateRoomList();
    }

    public otherLeftRoom(name: string): void {
        this._localPlayer.room.otherLeftRoom(name);
        this.updateRoomList();
    }

    public startedGame(sizeX: number, sizeY: number): void {
        this._localPlayer.room.startedGame(this._uiManager.createGrid(sizeX, sizeY, this._localPlayer.color));
        this._uiManager.textElement("Started game");
    }

    public placedTile(x: number, y: number, player: IPlayer): void {
        this._localPlayer.room.placedTile(x, y, player);
        this._uiManager.textElement(player + " played tile on:" + x + "|" + y);
    }

    private updateRoomList(): void {
        let roomList: string = "";
        if (this._localPlayer.room) { // check if room exists
            for (const player of this._localPlayer.room.otherPlayers) {
                roomList += player.name + "\n";
            }
        }
        this._uiManager.roomList(roomList);

    }

}
