/**
 * A grid that represents the game via a
 * 2 d array containing IPlayer.
 * The IPlayer represents the owner of the tile by indices
 */
import {Player} from "../Player";

export class ServerGrid {

    private readonly _sizeX: number;
    private readonly _sizeY: number;
    private _grid: Player[][];

    constructor(sizeX: number, sizeY: number) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this.createGrid(sizeX, sizeY);
    }

    /**
     * returns the grid
     * @returns {Player[][]}
     */
    get gridInfo(): Player[][] {
        return this._grid;
    }

    /**
     * return the amount of tiles in the grid
     * @returns {number}
     */
    get size(): number {
        return this._sizeX * this._sizeY;
    }

    /**
     * return the amount of tiles in the grid
     * @returns {number}
     */
    get sizeX(): number {
        return this._sizeX;
    }

    /**
     * return the amount of tiles in the grid
     * @returns {number}
     */
    get sizeY(): number {
        return this._sizeY;
    }

    /**
     * Create a grid by given sizes
     * @param {number} sizeX
     * @param {number} sizeY
     */
    private createGrid(sizeX: number, sizeY: number): void {
        const grid = [];
        for (let y = 0; y < sizeY; y++) {
            const row: Player[] = [];
            for (let x = 0; x < sizeX; x++) {
                row[x] = null;
            }
            grid[y] = row;
        }
        this._grid = grid;
    }

    /**
     * Place a tile om given location and return
     * whether is thas been successfull
     * @param {IPlayer} player
     * @param {number} y
     * @param {number} x
     * @returns {boolean}
     */
    public placeTile(player: Player, y: number, x: number): boolean {
        if (x < this._sizeX && y < this._sizeY) {
            this._grid[y][x] = player;
            return true;
        } else return false; // ToDo Someone is cheating
    }

    /**
     * Reset all tiles back to null
     * ofa given player
     * @param {IPlayer} player
     */
    public removePlayer(player: IPlayer): void {
        for (let y = 0; y < this._grid.length; y++) {
            for (let x = 0; x < this._grid[y].length; x++) {
                if (this._grid[y][x] === player) this._grid[y][x] = null;
            }
        }
    }

}
