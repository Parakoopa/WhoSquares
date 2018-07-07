import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import {RequestEmitter} from "../../Emitter/RequestEmitter";

export class Grid {

    private _grid: Sprite[][];

    /**
     * Players are talked to via socket and identified via unique id guid
     * @param _requestEmitter
     * @param _overColor
     * @param _sizeX
     * @param _sizeY
     * @param tileName
     * @param game
     * @param tileSize
     */
    constructor(
        private _requestEmitter: RequestEmitter,
        private _overColor: number,
        private _sizeX: number,
        private _sizeY: number,
        tileName: string,
        game: Game,
        tileSize: number
    ) {
        // ToDo move callback into gridfactory
        setTimeout(() =>
            {
                this.createGrid(game, tileName, tileSize);
            },
            500);
    }

    /**
     * @returns {number}
     */
    public get sizeX(): number {
        return this._sizeX;
    }

    /**
     * @returns {number}
     */
    public get sizeY(): number {
        return this._sizeY;
    }

    /**
     * Creates a 2D grid of image tiles
     * Adjusrs TileSizes, Offsets, etc.
     * Sets Color & Tint
     * Adds EventListener for Mouse to each Tile (OonDown, OnOver, OnOut)
     * @param game
     * @param imageName
     * @param cellSize
     * @constructor
     */
    private createGrid(game: Game, imageName: string, cellSize: number): void {
        console.log(game);
        console.log(game.world);
        const offset = this._sizeX * cellSize / 2.0;
        const xOffset: number = game.world.centerX - offset;
        const yOffset: number = game.world.centerY - offset;
        this._grid = [];

        //  Creates x sprites for each frame (a frame is basically a row)
        for (let y = 0; y < this._sizeY; y++) {
            const row = [];
            for (let x = 0; x < this._sizeX; x++) {
                const sprite = game.add.sprite(
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

    /**
     * Assign an IPlayer to a specific tile in grid
     * Tint the color based on the players color
     * Always saves the base color
     * @param {IPlayer} player
     * @param {number} x
     * @param {number} y
     */
    public placedTile(player: IPlayer, y: number, x: number) {
        if (!player) return; // tile is not owned by any player
        const sprite: Sprite =  this._grid[y][x];
        sprite.data.color = player.color; // save color on object as it is overwritten f.e. onOver
        this._grid[y][x].tint = player.color;
    }

    public removePlayer(player: IPlayer): void {
        for (const row of this._grid) {
            for (const sprite of row) {
                if (player.color === sprite.data.color) {
                    sprite.tint = 0x555555; // Initially Grey
                    sprite.data.color = 0x555555;
                }
            }
        }
    }
    /**
     * Destroys each tile of the grid,
     * thus destroying the grid.
     * Setting grid null is not enough as tiles are referenced
     * in game
     */
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
        this._requestEmitter.placeTile(sprite.data.y, sprite.data.x);
    }
}
