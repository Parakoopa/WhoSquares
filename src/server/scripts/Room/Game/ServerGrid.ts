/**
 * A grid that represents the game via a
 * 2 d array containing IPlayer.
 * The IPlayer represents the owner of the tile by indices
 */

export class ServerGrid {

    private readonly _sizeX: number;
    private readonly _sizeY: number;
    private _grid: IPlayer[][];

    constructor(sizeX: number, sizeY: number) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this.createGrid(sizeX, sizeY);
    }

    /**
     * returns the grid
     * @returns {IPlayer[][]}
     */
    get gridInfo(): IPlayer[][] {
        return this._grid;
    }

    /**
     * return the amount of tiles in the grid
     * @returns {number}
     */
    get size(): number {
        return this._sizeY * this._sizeY;
    }

    /**
     * Create a grid by given sizes
     * @param {number} sizeX
     * @param {number} sizeY
     */
    private createGrid(sizeX: number, sizeY: number): void {
        const grid = [];
        for (let y = 0; y < sizeY; y++) {
            const row: IPlayer[] = [];
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
    public placeTile(player: IPlayer, y: number, x: number): boolean {
        if (x < this._sizeX && y < this._sizeY) {
            const tileOwner = this._grid[y][x];
            if (!tileOwner || tileOwner.color !== player.color) { // Can't recolor own tilex
                 this._grid[y][x] = player;
                 return true;
             }
        }
        return false;
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
