import {Grid} from "./Grid";
import {InputManager} from "./InputManager";
import {RequestManager} from "./RequestManager";
import Game = Phaser.Game;
import Sprite = Phaser.Sprite;

export class GameManager {

    private _game: Game;
    private _textMessage = "warte auf server";
    private _textElement: Phaser.Text = null;
    private _roomListMessage = "Du bist in keinem Raum";
    private _roomListElement: Phaser.Text = null;
    private _roomNameMessage = "";
    private _roomNameElement: Phaser.Text = null;
    private _reqManager: RequestManager;
    private _inputManager: InputManager;
    private _grid: Grid;
    private _color: number = 0xffffff;
    private _turnInfoSprite: Sprite;

    constructor() {
        const self = this;
        const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
            preload() {
              self.centerGame(game);
              self.loadImages(game);
                // Manage Input
              self._inputManager = new InputManager(game);

            },
            create() {
                self.createButtons(game);
                self.createTexts(game);
            },
            update() {
                self._textElement.text = self._textMessage;
                self._roomListElement.text = self._roomListMessage;
                self._roomNameElement.text = self._roomNameMessage;
                self._inputManager.debug();
                }
        });
        this._game = game;
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

    /**
     * f.e. StartButton
     * @param {Phaser.Game} game
     */
    private createButtons(game: Game): void {
        const startButton = game.add.button(
            game.world.centerX - 82, 10, "startButton",
            () => this.startGame(), this, 2, 1, 0);
        const joinRoomButton1 = game.add.button(
            game.world.centerX + 118, 400, "joinRoom01",
            () => this.joinRoom("room01"), this, 2, 1, 0);
        const joinRoomButton2 = game.add.button(
            game.world.centerX + 118,  470, "joinRoom02",
            () => this.joinRoom("room02"), this, 2, 1, 0);
        const leaveRoomButton = game.add.button(
            game.world.centerX + 118,  540, "leaveRoom",
            () => this.leaveRoom(), this, 2, 1, 0);
    }

    /**
     * f.e. feedback text, turn info text +sprite
     * @param {Phaser.Game} game
     */
    private createTexts(game: Game): void {
        // TextElement
        this._textElement = game.add.text(
            game.world.centerX,
            game.world.centerY * 0.35,
            this._textMessage,
            {font: "32px Arial", fill: "#ff0044", align: "center"}
        );
        this._textElement.anchor.setTo(0.5, 0.5);

        // RoomName
        this._roomNameElement = game.add.text(
            game.world.centerX * 1.6,
            game.world.centerY - 70,
            this._roomNameMessage,
            {font: "32px Arial", fill: "#ff0044", align: "center"}
        );
        this._roomNameElement.anchor.setTo(0.5, 0.5);

        // RoomList
        this._roomListElement = game.add.text(
            game.world.centerX * 1.6,
            game.world.centerY,
            this._roomListMessage,
            {font: "32px Arial", fill: "#ff0044", align: "center"}
        );
        this._roomListElement.anchor.setTo(0.5, 0.5);

        const turnInfoText = game.add.text(
            game.world.centerX - 80,
            game.world.centerY * 0.4 + 4,
            "Turn of:",
            {font: "20px Arial", fill: "#555555", align: "center"}
        );

        this._turnInfoSprite = this._game.add.sprite(
            game.world.centerX,
            game.world.centerY * 0.4,
            "gridTile");
        this._turnInfoSprite.tint = 0xcccccc;
    }

    public color(color: number): void {
        this._color = color;
    }

    public createGrid(sizeX: number, sizeY: number) {
        this._grid = new Grid(this, this._game);
        this._grid.createGrid("gridTile", sizeX, sizeY, 40, this._color);
    }

    public destroyGrid() {
        this._grid.destroy();
    }


    public placeTile(x: number, y: number): void {
          this._reqManager.placeTile(x, y);
    }

    public placedTile(color: number, x: number, y: number): void {
        this._grid.placedTile(color, x, y);
    }

    public reqManager(reqManager: RequestManager) {
        this._reqManager = reqManager;
    }

    public textElement(text: string): void {
        this._textMessage = text;
    }

    public roomName(text: string): void {
        this._roomNameMessage = "room: " + text;
    }

    public roomList(text: string): void {
        this._roomListMessage = text;
    }

    private joinRoom(roomName: string): void {
        this._reqManager.joinRoom(roomName);
    }

    private leaveRoom(): void {
        this._reqManager.leaveRoom();
    }

    private startGame() {
        // ToDo Add InputFields to set sizeX & sizeY
        this._reqManager.startGame(5, 5);
    }

    public turnInfo(color: number): void {
        this._turnInfoSprite.tint = color;
    }

    public winGame(color: string): void {
        this._textMessage = "Winner: " + color;
    }

}
