import {Grid} from "./Grid";
import {InputManager} from "./InputManager";
import {RequestManager} from "./RequestManager";
import Game = Phaser.Game;

export class GameManager {

    private _game: Game;
    private _textMessage = "warte auf server";
    private _textElement: Phaser.Text = null;
    private _reqManager: RequestManager;
    private _inputManager: InputManager;
    private _grid: Grid;
    private _color: number = 0xffffff;

    constructor() {
        const self = this;
        const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
            preload() {
                // Center GameManager Canvas
                game.scale.pageAlignHorizontally = true;
                game.scale.pageAlignVertically = true;
                game.scale.refresh();

                // Load Images
                game.load.image("gridTile", "./img/square32_grey.png");
                game.load.image("startButton", "./img/startButton.png");

                // Manage Input
                self._inputManager = new InputManager(game);

            },
            create() {
                // Add Button to start GameManager
                const button = game.add.button(
                    game.world.centerX - 82, 10, "startButton",
                    () => self.startGame(), this, 2, 1, 0);

                // Add grid

                self._textElement = game.add.text(
                    game.world.centerX,
                    game.world.centerY,
                    self._textMessage,
                    {font: "32px Arial", fill: "#ff0044", align: "center"}
                );
                self._textElement.anchor.setTo(0.5, 5);
            },

            update() {
                self._textElement.text = self._textMessage;
                self._inputManager.Debug();
                }
        });
        this._game = game;

    }

    public color(color:number):void{
        this._color = color;
    }

    public createGrid(sizeX: number, sizeY: number) {
        this._grid = new Grid(this, this._game);
        this._grid.createGrid("gridTile", sizeX, sizeY, 40, this._color);
    }

    public placeTile(x: number, y: number): void {
          this._reqManager.PlaceTile(x, y);
    }

    public placedTile(color:number, x: number, y: number): void {
        this._grid.placedTile(color, x, y);
    }

    public reqManager(reqManager: RequestManager) {
        this._reqManager = reqManager;
    }

    public TextElement(text: string): void {
        this._textMessage = text;
    }

    private startGame() {
        // ToDo Add InputFields to set sizeX & sizeY
        this._reqManager.StartGame(5, 5);
    }

}
