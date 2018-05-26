import Sprite = Phaser.Sprite;
import {GameManager} from "./GameManager";
import Game = Phaser.Game;

export class Grid {

    private _sizeX: number;
    private _sizeY: number;
    private readonly _gameManager: GameManager;
    private _game: Phaser.Game;

    /**
     * Clients are talked to via socket and identified via unique id guid
     * @param gameManager
     * @param game
     */
    constructor(gameManager: GameManager, game: Game) {
        this._gameManager = gameManager;
        this._game = game;

    }

    public sizeX(): number {
        return this._sizeX;
    }

    public sizeY(): number {
        return this._sizeY;
    }
    /**
     * Creates a grid of image tiles
     * @param imageName
     * @param sizeX
     * @param sizeY
     * @param cellSize
     * @constructor
     */
    public createGrid(imageName: string, sizeX: number, sizeY: number, cellSize: number): void {

        this._sizeX = sizeX;
        this._sizeY = sizeY;
    //    const self = this;
        const offset = this._sizeX * cellSize / 2.0;
        const xOffset: number = this._game.world.centerX - offset;
        const yOffset: number = this._game.world.centerY - offset;

        //  Creates x sprites for each frame (a frame is basically a row)
        for (let y = 0; y < this._sizeY; y++) {
            for (let x = 0; x < this._sizeX; x++) {
                const sprite = this._game.add.sprite(
                    xOffset + cellSize * x,
                    yOffset + cellSize * y,
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
     * @param {Phaser.Sprite} sprite
     */
    public onDown(sprite: Sprite) {
        this._gameManager.placeTile(sprite.data.x, sprite.data.y);
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
