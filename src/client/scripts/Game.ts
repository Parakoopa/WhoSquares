import {Grid} from "./Grid";

export class Game {

    private _textMessage = "warte auf server";
    private _textElement: Phaser.Text = null;

    constructor() {
        const grid: Grid = new Grid(8, 8, 40);
        const self = this;
        const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
            preload() {
                // Center Game Canvas
                game.scale.pageAlignHorizontally = true;
                game.scale.pageAlignVertically = true;
                game.scale.refresh();

                // Load Grid
                game.load.image("gridTile", "./img/square32_grey.png");

            },
            create() {
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

    public TextElement(text: string): void {
        this._textMessage = text;
    }

}
