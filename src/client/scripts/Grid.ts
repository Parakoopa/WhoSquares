import Sprite = Phaser.Sprite;
import {GameManager} from "./GameManager";
import Game = Phaser.Game;

export class Grid {

    private _grid: Sprite[][];
    private _sizeX: number;
    private _sizeY: number;
    private readonly _gameManager: GameManager;
    private _game: Phaser.Game;
    private _overColor: number;

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

    public placedTile(color: number, x: number, y: number) {
        console.log(this._grid);
        console.log(this._grid.length);
        console.log(this._grid[x].length);
        console.log(this._grid[x][y]);
       const sprite: Sprite =  this._grid[y][x];
       sprite.data.color = color; // save color on object as it is overwritten f.e. onOver
       this._grid[y][x].tint = color;
    }

    /**
     * Creates a grid of image tiles
     * @param imageName
     * @param sizeX
     * @param sizeY
     * @param cellSize
     * @param overColor
     * @constructor
     */
    public createGrid(imageName: string, sizeX: number, sizeY: number, cellSize: number, overColor: number): void {

        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._overColor = overColor;
    //    const self = this;
        const offset = this._sizeX * cellSize / 2.0 - 20; // Why -20? not centered otherwise whyever
        const xOffset: number = this._game.world.centerX - offset;
        const yOffset: number = this._game.world.centerY - offset;
        this._grid = [];
        //  Creates x sprites for each frame (a frame is basically a row)
        for (let y = 0; y < this._sizeY; y++) {
            const row = [];
            for (let x = 0; x < this._sizeX; x++) {
                console.log(x + "  " + y);
                const sprite = this._game.add.sprite(
                    xOffset + cellSize * x,
                    yOffset + cellSize * y,
                    imageName);
                sprite.name = "tile" + y + "_" + x;
                sprite.data.x = x;
                sprite.data.y = y;
                sprite.tint = 0x555555; // Initially Grey
                sprite.data.color = 0x555555;
                sprite.inputEnabled = true;
                sprite.events.onInputDown.add(this.onDown, this, 0, sprite);
                sprite.events.onInputOver.add(this.onOver, this);
                sprite.events.onInputOut.add(this.onOut, this);
                row[x] = sprite;
            }
            this._grid[y] = row;
        }
        console.log(this._grid.length);

    }

    /**
     * Hover Color
     * (While mouse is over tile)
     * @param {Phaser.Sprite} sprite
     */
    private onOver(sprite: Sprite) {
        sprite.tint = this._overColor;
    }

    /**
     * Reset tint to show original color
     * @param {Phaser.Sprite} sprite
     */
    private onOut(sprite: Sprite) {
        sprite.tint = sprite.data.color;
    }

    /**
     * Ask server to color clicked tile
     * (Overwrites onOver)
     * @param {Phaser.Sprite} sprite
     */
    public onDown(sprite: Sprite) {
        this._gameManager.placeTile(sprite.data.x, sprite.data.y);
    }
}
