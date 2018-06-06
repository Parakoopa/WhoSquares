import Game = Phaser.Game;
import {InputManager} from "./InputManager";
import Sprite = Phaser.Sprite;

export class UiManager {

    private _textElement: Phaser.Text = null;
    private _roomListElement: Phaser.Text = null;
    private _roomNameElement: Phaser.Text = null;

    private _turnInfoSprite: Sprite;

    constructor(private _game: Game, private _inputManager: InputManager) {    }

    public createUi(): void {
        this.createButtons(this._game);
        this.createTexts(this._game);
    }

    public update() {
        // All Updates are currently event based - Woho!
    }
    /**
     * f.e. StartButton
     * @param {Phaser.Game} this._game
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
            game.world.centerY - 70,
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

    public winGame(color: string): void {
        this._textElement.text = "Winner: " + color;
    }

}
