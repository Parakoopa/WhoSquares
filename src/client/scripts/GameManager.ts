import {Grid} from "./Grid";
import {InputManager} from "./InputManager";
import {RequestManager} from "./RequestManager";

export class GameManager {

    private _textMessage = "warte auf server";
    private _textElement: Phaser.Text = null;
    private _reqManager: RequestManager;
    private _inputManager: InputManager;
    private _grid: Grid;

    constructor() {
        this._grid = new Grid(this, 8, 8, 40);
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
                self._grid.CreateGrid(game, "gridTile");

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

    }

    public placeTile(tileName: string): void {
          this._reqManager.PlaceTile(tileName);
    }

    public reqManager(reqManager: RequestManager) {
        this._reqManager = reqManager;
    }

    public TextElement(text: string): void {
        this._textMessage = text;
    }

    private startGame() {
        this._reqManager.StartGame();
    }

}
