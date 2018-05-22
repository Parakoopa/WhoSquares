import {Grid} from "./Grid";
import {RequestManager} from "./RequestManager";

export class Game {

    private _textMessage = "warte auf server";
    private _textElement: Phaser.Text = null;
    private _reqManager: RequestManager;

    constructor() {
        const grid: Grid = new Grid(8, 8, 40);
        const self = this;
        const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
            preload() {
                // Center Game Canvas
                game.scale.pageAlignHorizontally = true;
                game.scale.pageAlignVertically = true;
                game.scale.refresh();

                // Load Images
                game.load.image("gridTile", "./img/square32_grey.png");
                game.load.image("startButton", "./img/startButton.png");

            },
            create() {
                // Add Button to start Game
                const button = game.add.button(game.world.centerX - 82, 10, "startButton", self.startGame, this, 2, 1, 0);
                // Add grid
                grid.CreateGrid(game, "gridTile");

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
            }
        });

    }

    public reqManager(reqManager: RequestManager) {
        this._reqManager = reqManager;
    }

    public TextElement(text: string): void {
        this._textMessage = text;
    }

    private startGame() {
        console.log(this._reqManager);
        this._reqManager.StartGame();
    }

}
