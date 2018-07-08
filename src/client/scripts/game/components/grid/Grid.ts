import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import {RequestEmitter} from "../../Emitter/RequestEmitter";
import {PhaserGame} from "../PhaserGame";

export class Grid {

    private _grid: Sprite[][];
    private _highlightedSprites: Sprite[];
    private _isPhaserLoaded: Promise<Phaser.Game>;

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
        game: PhaserGame,
        tileSize: number
    ) {
        this._highlightedSprites = [];
        this._isPhaserLoaded = game.loaded();
        this._isPhaserLoaded.then((canvas) =>  {
            this.createGrid(canvas, tileName, tileSize);
        });
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
        const offset = this._sizeX * cellSize / 2.0;
        const xOffset: number = game.world.centerX - offset + 10; //  // 10 Offset to allow mouse exit events
        const yOffset: number = game.world.centerY - offset + 10; //  // 10 Offset to allow mouse exit events
        this._grid = [];
        window.addEventListener("mouseout", this.resetHighlightedSprites, true);
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
        this._isPhaserLoaded.then(() => {
            if (!player) return; // tile is not owned by any player
            const sprite: Sprite =  this._grid[y][x];
            sprite.data.color = player.color; // save color on object as it is overwritten f.e. onOver
            this._grid[y][x].tint = player.color;
        });
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

    public showWinTiles(winTiles: ITile[]) {
        for (const tile of winTiles) {
            this._grid[tile.y][tile.x].loadTexture("winTile");
        }

    }
    /**
     * Destroys each tile of the grid,
     * thus destroying the grid.
     * Setting grid null is not enough as tiles are referenced
     * in game
     */
    public destroy(): void {
        const game = document.getElementById("game");
        if (!game) return;
        while (game.firstChild) {
            game.removeChild(game.firstChild);
        }

    }

    /**
     * Hover Color
     * (While mouse is over tile)
     * @param {Phaser.Sprite} sprite
     */
    private onOver(sprite: Sprite) {
        this._highlightedSprites.push(sprite);
        sprite.tint = this._overColor;
    }

    /**
     * Reset tint to show original color
     * @param {Phaser.Sprite} sprite
     */
    private onOut(sprite: Sprite) {
        this.resetHighlightedSprites();
    }

    private resetHighlightedSprites() {
        if (!this._highlightedSprites) return; // This may not refer to grid as this eventListener is global
        for (const sprite of this._highlightedSprites) {
            sprite.tint = sprite.data.color;
        }
        this._highlightedSprites = [];
    }

    /**
     * Ask server to color clicked tile
     * (Overwrites onOver)
     * @param {Phaser.Sprite} sprite
     */
    public onDown(sprite: Sprite) {
  //      if (sprite.data.color === this._overColor) return; // Can't recolor own tiles
        this._requestEmitter.placeTile(sprite.data.y, sprite.data.x);
    }
}
