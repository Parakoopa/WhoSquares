import Game = Phaser.Game;
import {Grid} from "./Grid";
import {LocalPlayer} from "./LocalPlayer";
import {ResponseReceiver} from "./ResponseReceiver";
import {UiManager} from "./UiManager";

export class GameManager {

    private _game: Game;
    private _socket: SocketIOClient.Socket;
    private _uiManager: UiManager;
    private _responseReceiver: ResponseReceiver;
    private _localPlayer: LocalPlayer;

    /**
     * Create Game, Layout Game, Load Images
     * Initialize UiManager
     * Initialize ResponseReceiver
     * Start UpdateLoop (Client only Updates UI & Logic stuff only by Server Events)
     */
    constructor() {
        const self = this;
        const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
            preload() {
              self.centerGame(game);
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
     * Center the game inside the window
     * @param {Phaser.Game} game
     */
    private centerGame(game: Game): void {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.refresh();
    }

    /**
     * Create a single local Player which represents the Client in rooms/games
     * Create RequestEmitter, as requests always involve a connected local player
     * @param {IPlayer} player
     * @param {string} key
     */
    public addLocalPlayer(player: IPlayer, key: string): void {
        this._localPlayer = new LocalPlayer(player, key);
        this._uiManager.inputManager.createRequestEmitter(this._socket, this._localPlayer);
        this._uiManager.textElement("LocalPlayer: " +  this._localPlayer.name);
    }

    /**
     * Tell room that localPlayer joined
     * If it contains a grid (running game) so create the grid
     * ToDo display client his role (player/observer)
     * @param {IJoinedResponse} resp
     */
    public joinedRoom(resp: IJoinedResponse) {
    // if(this._localPlayer.room) { seems to be redundant as server checks
    //    this._uiManager.textElement("You are already in a room. Leave first!");
    // }
        this._localPlayer.joinedRoom(resp);
        // If game already started, recreate grid
        if (resp.gridInfo) {
            console.log("color: " + this._localPlayer.color);
            const grid: Grid = this._uiManager.createGridByInfo(resp.gridInfo, this._localPlayer.color);
            this._localPlayer.room.startedGame(grid);
        }
        this._uiManager.textElement("joined Room - Color: " + resp.color);
        this._uiManager.roomName(resp.roomName);
        this.updateRoomList();
    }

    /**
     * Tell room that localPlayer left & update Ui
     */
    public leftRoom(): void {
        this._localPlayer.leftRoom();
        this._uiManager.textElement("left room");
        this._uiManager.roomName("left room");
        this.updateRoomList();
    }

    /**
     * Tell room that Otherplayer joined & update Ui
     * @param {IPlayer} otherPlayer
     */
    public otherJoinedRoom(otherPlayer: IPlayer): void {
        this._localPlayer.room.otherJoinedRoom(otherPlayer);
        this.updateRoomList();
    }

    /**
     * Check if player really is in  a room
     * Tell room that otherPlayer left & update Ui
     * @param player
     */
    public otherLeftRoom(player: IPlayer): void {
        if (!this._localPlayer.room) return;
        this._localPlayer.room.otherLeftRoom(player);
        this.updateRoomList();
    }

    /**
     * Tell room to create game with given sizes & update Ui
     * @param {number} sizeX
     * @param {number} sizeY
     */
    public startedGame(sizeX: number, sizeY: number): void {
        this._localPlayer.room.startedGame(this._uiManager.createGrid(sizeX, sizeY, this._localPlayer.color));
        this._uiManager.textElement("Started game");
    }

    /**
     * Tell room to place Tile & updateUi
     * @param {number} x
     * @param {number} y
     * @param {IPlayer} player
     */
    public placedTile(x: number, y: number, player: IPlayer): void {
        this._localPlayer.room.placedTile(x, y, player);
        this._uiManager.textElement(player + " played tile on:" + x + "|" + y);
    }

    /**
     * Create a string OtherPlayers in room
     * Tell UiManager to display it
     */
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
