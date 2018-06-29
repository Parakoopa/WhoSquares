import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import {Grid} from "./Grid";
import {InputManager} from "./InputManager";

export class UiManager {

    private _textElement: Phaser.Text = null;
    private _startGameElement: Phaser.Text = null;
    private _roomListElement: Phaser.Text = null;
    private _roomNameElement: Phaser.Text = null;

    private _turnInfoSprite: Sprite;
    private _gridBackground: Sprite;
    private _inputManager: InputManager;

    /**
     * Has an InputManager to be able of adding Events
     * to interactive Ui Elements (f.e. buttons)
     * @param {Phaser.Game} _game
     */
    constructor(private _game: Game) {
        this._inputManager = new InputManager(_game);
        this.loadImages(_game);
    }

    /**
     * Somehow neccessary due to client infrastructure
     * //ToDo try to refactor components dependencies to get rid off
     * @returns {InputManager}
     */
    public get inputManager(): InputManager {
        return this._inputManager;
    }

    /**
     * Create buttons & texts
     */
    public createUi(): void {
        this._game.add.tileSprite(0, 0, 800, 600, "background");

        this.createButtons(this._game);
        this.createTexts(this._game);
    }

    /**
     * Update Loop For Ui Elements
     */
    public update() {
        // All Updates are currently event based - Woho!
        this._inputManager.debug();
    }

    /**
     * Load Images from /img directory
     * Images get stored by key in this (game)
     * @param {Phaser.Game} game
     */
    private loadImages(game: Game): void {
        game.load.image("background", "./img/background.png");
        game.load.image("gridTile", "./img/square32_grey.png");
        game.load.image("startButton", "./img/startButton2.png");
        game.load.image("joinRoom01", "./img/joinRoom01.png");
        game.load.image("joinRoom02", "./img/joinRoom02.png");
        game.load.image("leaveRoom", "./img/leaveRoom.png");
    }

    /**
     * Create Buttons
     * @param {Phaser.Game} game
     */
    private createButtons(game: Game): void {
        const startButton = game.add.button(
            game.world.centerX - 150, 20, "startButton",
            () => this._inputManager.startGame(), game, 2, 1, 0);
        const joinRoomButton1 = game.add.button(
            game.world.centerX + 118, 400, "joinRoom01",
            () => this._inputManager.joinRoom("room01"), game, 2, 1, 0);
        const joinRoomButton2 = game.add.button(
            game.world.centerX + 118,  470, "joinRoom02",
            () => this._inputManager.joinRoom("room02"), game, 2, 1, 0);
        const leaveRoomButton = game.add.button(
            game.world.centerX + 118,  540, "leaveRoom",
            () => this._inputManager.leaveRoom(), game, 2, 1, 0);
    }

    /**
     * Create Text Elements (Feedback messages, Display OtherPlayers in Room, etc.)
     * Create TurnInfoSprite (Square that is tinted in the color of the current player at turn)
     * @param {Phaser.Game} game
     */
    private createTexts(game: Game): void {
        // TextElement
        this._textElement = game.add.text(
            game.world.centerX,
            game.world.centerY * 0.35,
            "Bla",
            {font: "32px Sunflower", fill: "#ff0044", align: "center"}
        );
        this._textElement.anchor.setTo(0.5, 0.5);

        // Start GameWrapper Text
        this._startGameElement = game.add.text(
            game.world.centerX,
            58,
            "START GAME",
            { font: "32px Sunflower", fill: "#FFFFFF", align: "center" }
        );
        this._startGameElement.anchor.setTo(0.5, 0.5);

        // RoomName
        this._roomNameElement = game.add.text(
            game.world.centerX * 1.6,
            game.world.centerY - 130,
            "Raumname",
            {font: "32px Sunflower", fill: "#ff0044", align: "center"}
        );
        this._roomNameElement.anchor.setTo(0.5, 0.5);

        // RoomList
        this._roomListElement = game.add.text(
            game.world.centerX * 1.6,
            game.world.centerY,
            "Du bist in keinem Raum",
            {font: "32px Sunflower", fill: "#ff0044", align: "center"}
        );
        this._roomListElement.anchor.setTo(0.5, 0.5);

        const turnInfoText = game.add.text(
            game.world.centerX - 80,
            game.world.centerY * 0.4 + 4,
            "Turn of:",
            {font: "20px Sunflower", fill: "#555555", align: "center"}
        );

        this._turnInfoSprite = this._game.add.sprite(
            game.world.centerX,
            game.world.centerY * 0.4,
            "gridTile");
        this._turnInfoSprite.tint = 0xcccccc;
    }

    /**
     * Create a grid of given image, sizes & color
     * Is owned by room but called here as it consists of ui elements
     * @param {number} sizeX
     * @param {number} sizeY
     * @param {number} color
     * @returns {Grid}
     */
    public createGrid(sizeX: number, sizeY: number, color: number): Grid {
        const grid = new Grid(this._game, this._inputManager);
        grid.createGrid("gridTile", sizeX, sizeY, 40, color);
        return grid;
    }

    /**
     * Recreates a grid that already exists on server side
     * Is owned by room but called here as it consists of ui elements
     * @param {IPlayer[][]} gridInfo
     * @param {number} color
     * @returns {Grid}
     */
    public createGridByInfo(gridInfo: IPlayer[][], color: number): Grid {
        const grid = this.createGrid(gridInfo[0].length, gridInfo.length, color);
        grid.placedTiles(gridInfo);
        return grid;
    }

    /**
     * Display feedback text
     * @param {string} text
     */
    public textElement(text: string): void {
        this._textElement.text = text;
    }

    /**
     * Display current room name
     * @param {string} text
     */
    public roomName(text: string): void {
        this._roomNameElement.text = "room: " + text;
    }

    /**
     * Display list of Otherplayers in room
     * @param {string} text
     */
    public roomList(text: string): void {
        this._roomListElement.text = text;
    }

    /**
     * Color the square based on color of current players turn
     * @param {number} color
     */
    public turnInfo(color: number): void {
        this._turnInfoSprite.tint = color;
    }

    /**
     * Display winner of current game
     * @param {string} name
     */
    public winGame(name: string): void {
        this._textElement.text = "Winner: " + name;
    }

}
