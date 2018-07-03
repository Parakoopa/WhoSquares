import Game = Phaser.Game;
import {IUserInterface} from "../ui/IUserInterface";
import {Grid} from "./Grid";
import {InputManager} from "./InputManager";
import {LocalPlayer} from "./LocalPlayer";
import {ResponseManager} from "./ResponseManager/ResponseManager";

export class GameManager {

    private _socket: SocketIOClient.Socket;
    public _game: Game;
    public _inputManager: InputManager;
    public _localPlayer: LocalPlayer;
    private _eventListener: ResponseManager;
    private _ui: IUserInterface;
    private _username: string;

    /**
     * Create Room, Layout Room, Load Images
     * Initialize UiManager
     * Initialize ResponseReceiver
     * Start UpdateLoop (Client only Updates UI & Logic stuff only by Server Events)
     */
    constructor(socket: SocketIOClient.Socket, ui: IUserInterface) {
        this._ui = ui;
        this._username = ui.getUsername();
        this._socket = socket;

        const self = this;
        const game = new Phaser.Game("100", "100", Phaser.AUTO, "game", {
            preload() {
                self._inputManager = new InputManager(game);

                game.load.image("gridTile", "./img/square32_grey.png");
            },
            create() {
                self._game = game;
                self._eventListener = new ResponseManager(self, self._socket, self._ui);
            }
        }, true);

    }

    /**
     * Create a single local Player which represents the Client in rooms/games
     * Create RequestEmitter, as requests always involve a connected local player
     * @param {IPlayer} player
     * @param {string} key
     */
    public addLocalPlayer(player: IPlayer, key: string): void {
        this._localPlayer = new LocalPlayer(player, key);
        this._inputManager.createRequestEmitter(this._socket, this._localPlayer);
        this._ui.updateGameInfo("LocalPlayer: " + this._localPlayer.name);
        this._inputManager.joinRoom(this._ui.getRoomID());
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
            const grid: Grid = Grid.createGridByInfo(resp.gridInfo, this);
            this._localPlayer.room.startedGame(grid);
        }
        this._ui.updateGameInfo("You joined, color: " + resp.color);
        this.updateRoomList();
    }

    /**
     * Action for leaving the room
     */
    public actionLeaveRoom(): void {
        this._inputManager.leaveRoom();
    }

    /**
     * Action for starting the game
     */
    public actionStartGame(): void {
        this._inputManager.startGame();
    }

    /**
     * Tell room that localPlayer left & update Ui
     */
    public leftRoom(): void {
        this._localPlayer.leftRoom();
        this._ui.updateGameInfo("left room");
        this.updateRoomList();
        this._ui.leftRoom();
    }

    /**
     * Tell room that Otherplayer joined & update Ui
     * @param {IPlayer} otherPlayer
     */
    public otherJoinedRoom(otherPlayer: IPlayer): void {
        this._localPlayer.room.otherJoinedRoom(otherPlayer);
        this._ui.updateGameInfo(otherPlayer.name + "joined");
        this.updateRoomList();
    }

    /**
     * Check if player really is in  a room
     * Tell room that otherPlayer left & update Ui
     * @param player
     */
    public otherLeftRoom(player: IPlayer): void {
        if (!this._localPlayer.room) return; // player currently disconnected
        this._localPlayer.room.otherLeftRoom(player);
        this._ui.updateGameInfo(player.name + "left");
        this.updateRoomList();
    }

    /**
     * Tell room to create game with given sizes & update Ui
     * @param {number} sizeX
     * @param {number} sizeY
     */
    public startedGame(sizeX: number, sizeY: number): void {
        const grid = Grid.createGrid(sizeX, sizeY, this);

        this._localPlayer.room.startedGame(grid);
        this._ui.updateGameInfo("Room has been started!");
    }

    /**
     * Tell room to place Tile & updateUi
     * @param {number} x
     * @param {number} y
     * @param {IPlayer} player
     */
    public placedTile(y: number, x: number, player: IPlayer): void {
        if (!this._localPlayer) return; // player currently disconnected
        if (!this._localPlayer.room) return; // player currently not in room
        this._localPlayer.room.placedTile(y, x, player);
        this._ui.updateGameInfo(player + " colored: " + x + "|" + y);
    }

    /**
     * Update Ui to display winner
     * @param {IPlayer} player
     */
    public winGame(player: IPlayer): void {
        this._ui.updateWinner(player);
    }

    /**
     * Update Ui for current players turn
     * @param {IPlayer} player
     */
    public turnInfo(player: IPlayer): void {
        this._ui.updateTurnInfo( player );
    }

    /**
     * Create a string OtherPlayers in room
     * Tell UiManager to display it
     */
    private updateRoomList(): void {
        if (this._localPlayer.room) {
            this._ui.updatePlayerlist(this._localPlayer.room.otherPlayers);
        }
    }

}
