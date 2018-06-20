/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
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

    get gridInfo(): IPlayer[][] {
        return this._grid;
    }

    get size(): number {
        return this._sizeY * this._sizeY;
    }

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

    public placeTile(player: IPlayer, y: number, x: number): boolean {
        if (x < this._sizeX && y < this._sizeY) {
            this._grid[y][x] = player;
            return true;
        } else return false; // ToDo Someone is cheating
    }

    public removePlayer(player: IPlayer): void {
        for (let y = 0; y < this._grid.length; y++) {
            for (let x = 0; x < this._grid[y].length; x++) {
                if (this._grid[y][x] === player) this._grid[y][x] = null;
            }
        }
    }

}
