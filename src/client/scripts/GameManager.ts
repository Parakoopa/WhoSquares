import {Grid} from "./Grid";
import {InputManager} from "./InputManager";
import {LocalPlayer} from "./LocalPlayer";
import Game = Phaser.Game;
import {RequestEmitter} from "./RequestEmitter";
import {ResponseReceiver} from "./ResponseReceiver";
import {UiManager} from "./UiManager";

export class GameManager {

    private _game: Game;
    private _socket: SocketIOClient.Socket;
    private _inputManager: InputManager;
    private _uiManager: UiManager;
    private _requestEmitter: RequestEmitter;
    private _responseReceiver: ResponseReceiver;
    private _grid: Grid;

    constructor() {

        const self = this;
        const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
            preload() {
              self.centerGame(game);
              self.loadImages(game);
              self._inputManager = new InputManager(game);
              self._uiManager = new UiManager(game, self._inputManager);
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
                self._inputManager.debug();
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

    public RequestEmitter(localPlayer: LocalPlayer) {
        this._requestEmitter = new RequestEmitter(this._socket, localPlayer);
        this._inputManager.requestEmitter = this._requestEmitter;
    }

    public createGrid(sizeX: number, sizeY: number, color: number) {
        this._grid = new Grid(this._game, this._inputManager);
        this._grid.createGrid("gridTile", sizeX, sizeY, 40, color);
    }

    public destroyGrid() {
        if (!this._grid) return; // Game has not yet started
        this._grid.destroy();
    }

    public placedTile(color: number, x: number, y: number): void {
        this._grid.placedTile(color, x, y);
    }

}
