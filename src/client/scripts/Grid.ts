import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import {InputManager} from "./InputManager";

export class Grid {

    private _grid: Sprite[][];
    private _sizeX: number;
    private _sizeY: number;
    private _overColor: number;

    /**
     * Players are talked to via socket and identified via unique id guid
     * @param _game
     * @param _inputManager
     */
    constructor(private _game: Game, private _inputManager: InputManager) {}

    public sizeX(): number {
        return this._sizeX;
    }

    public sizeY(): number {
        return this._sizeY;
    }

    public placedTile(player: IPlayer, x: number, y: number) {
        if (!player) return; // tile is not owned by any player
        const sprite: Sprite =  this._grid[y][x];
        sprite.data.color = player.color; // save color on object as it is overwritten f.e. onOver
        this._grid[y][x].tint = player.color;
    }

    public placedTiles(gridInfo: IPlayer[][]) {
        for (let y = 0; y < gridInfo.length; y++) {
            for (let x = 0; x < gridInfo[y].length; x++) {
                this.placedTile(gridInfo[y][x], x, y);
            }
        }
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
                const sprite = this._game.add.sprite(
                    xOffset + cellSize * x,
                    yOffset + cellSize * y,
                    imageName);
            //    sprite.name = "tile" + y + "_" + x;
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

    }

    public destroy(): void {
        for (let y = 0; y < this._grid.length; y++) {
            for (let x = 0; x < this._grid[y].length; x++) {
               this._grid[y][x].destroy(true);
            }
        }
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
        this._inputManager.placeTile(sprite.data.x, sprite.data.y);
    }
}
