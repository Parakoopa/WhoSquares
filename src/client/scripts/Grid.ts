import Sprite = Phaser.Sprite;
import {GameManager} from "./GameManager";
import Game = Phaser.Game;

export class Grid {

    private readonly _sizeX: number;
    private readonly _sizeY: number;
    private readonly _cellSize: number;
    private readonly _gameManager: GameManager;

    /**
     * Clients are talked to via socket and identified via unique id guid
     * @param gameManager
     * @param sizeX
     * @param sizeY
     * @param cellSize
     */
    constructor(gameManager: GameManager, sizeX: number, sizeY: number, cellSize: number) {
        this._gameManager = gameManager;
        console.log(this._gameManager);
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._cellSize = cellSize;

    }

    public sizeX(): number {
        return this._sizeX;
    }

    public sizeY(): number {
        return this._sizeY;
    }
    /**
     * Creates a grid of image tiles
     * @param {Phaser.Game} game
     * @param imageName
     * @constructor
     */
    public CreateGrid(game: Game, imageName: string): void {
    //    const self = this;
        const offset = this._sizeX * this._cellSize / 2.0;
        const xOffset: number = game.world.centerX - offset;
        const yOffset: number = game.world.centerY - offset;

        //  Creates x sprites for each frame (a frame is basically a row)
        for (let y = 0; y < this._sizeY; y++) {
            for (let x = 0; x < this._sizeX; x++) {
                let sprite = game.add.sprite(
                    xOffset + this._cellSize * x,
                    yOffset + this._cellSize * y,
                    imageName);
                sprite.name = "tile" + y + "_" + x;
                sprite.data.x = x;
                sprite.data.y = y;
                sprite.inputEnabled = true;
                sprite.events.onInputDown.add(this.onDown, this, 0, sprite);
                sprite.events.onInputOver.add(this.onOver, this);
                sprite.events.onInputOut.add(this.onOut, this);
            }
        }

    }

    /**
     * Change Color of clicked tile while on it
     * (Overwrites onOver)
     * @param self
     * @param {Phaser.Sprite} sprite
     */
    public onDown(sprite: Sprite) {
        this._gameManager.placeTile(sprite.x, sprite.y);
        sprite.tint = 0x00ff00;

    }

    /**
     * Hover Color
     * (While mouse is over tile)
     * @param {Phaser.Sprite} sprite
     */
    private onOver(sprite: Sprite) {
        sprite.tint = 0xff0000;
    }

    /**
     * Reset tint to show original color
     * @param {Phaser.Sprite} sprite
     */
    private onOut(sprite: Sprite) {
        sprite.tint = 0xffffff;
    }

}
