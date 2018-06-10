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
        const player: IPlayer = null; // default Value
        const grid = [];
        for (let y = 0; y < sizeY; y++) {
            const row: IPlayer[] = [];
            for (let x = 0; x < sizeX; x++) {
                row[x] = player;
            }
            grid[y] = row;
        }
        this._grid = grid;
    }

    public placeTile(player: IPlayer, x: number, y: number): boolean {
        if (x < this._sizeX && y < this._sizeY) {
            this._grid[x][y] = player;
            return true;
        } else return false; // ToDo Someone is cheating
    }

}
