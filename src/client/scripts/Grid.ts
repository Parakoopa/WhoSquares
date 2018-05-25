import Game = Phaser.Game;
import Sprite = Phaser.Sprite;

export class Grid {

    private readonly _sizeX: number;
    private readonly _sizeY: number;
    private readonly _cellSize: number;

    /**
     * Clients are talked to via socket and identified via unique id guid
     * @param sizeX
     * @param sizeY
     * @param cellSize
     */
    constructor(sizeX: number, sizeY: number, cellSize: number) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._cellSize = cellSize;

    }

    /**
     * Creates a grid of image tiles
     * @param {Phaser.Game} game
     * @param imageName
     * @constructor
     */
    public CreateGrid(game: Game, imageName: string): void {
        const offset = this._sizeX * this._cellSize / 2.0;
        const xOffset: number = game.world.centerX - offset;
        const yOffset: number = game.world.centerY - offset;


        //  Creates x sprites for each frame (a frame is basically a row)
        for (let y = 0; y < this._sizeY; y++) {
            for (let x = 0; x < this._sizeX; x++) {
                const sprite = game.add.sprite(
                    xOffset + this._cellSize * x,
                    yOffset + this._cellSize * y,
                    imageName);
                sprite.name = "tile" + y + "_" + x;
                sprite.inputEnabled = true;
                sprite.events.onInputDown.add(Grid.onDown, this);
                sprite.events.onInputOver.add(Grid.onOver, this);
                sprite.events.onInputOut.add(Grid.onOut, this);
            }
        }

    }

    /**
     * Change Color of clicked tile while on it
     * (Overwrites onOver)
     * @param {Phaser.Sprite} sprite
     */
    public static onDown(sprite: Sprite) {
        console.log("Works");
        sprite.tint = 0x00ff00;
    }

    /**
     * Hover Color
     * (While mouse is over tile)
     * @param {Phaser.Sprite} sprite
     */
    private static onOver(sprite: Sprite) {
        console.log("Works2");
        sprite.tint = 0xff0000;
    }

    /**
     * Reset tint to show original color
     * @param {Phaser.Sprite} sprite
     */
    private static onOut(sprite: Sprite) {
        console.log("Works3");
        sprite.tint = 0xffffff;
    }

}
