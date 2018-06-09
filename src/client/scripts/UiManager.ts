import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import {Grid} from "./Grid";
import {InputManager} from "./InputManager";

export class UiManager {

    private _textElement: Phaser.Text = null;
    private _roomListElement: Phaser.Text = null;
    private _roomNameElement: Phaser.Text = null;

    private _turnInfoSprite: Sprite;
    private _inputManager: InputManager;

    constructor(private _game: Game) {
        this._inputManager = new InputManager(_game);
    }

    public createUi(): void {
        this.createButtons(this._game);
        this.createTexts(this._game);
    }

    public update() {
        // All Updates are currently event based - Woho!
        this._inputManager.debug();
    }

    public get inputManager(): InputManager { // todo get rid of
        return this._inputManager;
    }

    /**
     * f.e. StartButton
     * @param {Phaser.Game} game
     */
    private createButtons(game: Game): void {
        const startButton = game.add.button(
            game.world.centerX - 82, 10, "startButton",
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
     * f.e. feedback text, turn info text +sprite
     * @param {Phaser.Game} game
     */
    private createTexts(game: Game): void {
        // TextElement
        this._textElement = game.add.text(
            game.world.centerX,
            game.world.centerY * 0.35,
            "Bla",
            {font: "32px Arial", fill: "#ff0044", align: "center"}
        );
        this._textElement.anchor.setTo(0.5, 0.5);

        // RoomName
        this._roomNameElement = game.add.text(
            game.world.centerX * 1.6,
            game.world.centerY - 130,
            "Raumname",
            {font: "32px Arial", fill: "#ff0044", align: "center"}
        );
        this._roomNameElement.anchor.setTo(0.5, 0.5);

        // RoomList
        this._roomListElement = game.add.text(
            game.world.centerX * 1.6,
            game.world.centerY,
            "Du bist in keinem Raum",
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

    public createGrid(sizeX: number, sizeY: number, color: number): Grid {
        const grid = new Grid(this._game, this._inputManager);
        grid.createGrid("gridTile", sizeX, sizeY, 40, color);
        return grid;
    }

    public createGridByInfo(gridInfo: IPlayer[][], color: number): Grid {
        const grid = this.createGrid(gridInfo[0].length, gridInfo.length, color);
        grid.placedTiles(gridInfo);
        return grid;
    }

    public textElement(text: string): void {
        this._textElement.text = text;
    }

    public roomName(text: string): void {
        this._roomNameElement.text = "room: " + text;
    }

    public roomList(text: string): void {
        this._roomListElement.text = text;
    }

    public turnInfo(color: number): void {
        this._turnInfoSprite.tint = color;
    }

    public winGame(name: string): void {
        this._textElement.text = "Winner: " + name;
    }

}
