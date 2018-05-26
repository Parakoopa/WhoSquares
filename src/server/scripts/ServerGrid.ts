/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
 */
import {Client} from "./Client";

export class ServerGrid {

    private readonly _sizeX: number;
    private readonly _sizeY: number;
    private _grid: any[][];

    constructor(sizeX: number, sizeY: number) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this.createGrid(sizeX, sizeY);
    }

    private createGrid(sizeX: number, sizeY: number): void {
        const client: Client = null; // default Value
        const grid = [];
        for (let y = 0; y < sizeY; y++) {
            const row: Client[] = [];
            for (let x = 0; x < sizeX; x++) {
                row[x] = client;
            }
            grid[y] = row;
        }
        this._grid = grid;
    }

    public placeTile(client: Client, x: number, y: number): boolean {
        if (x < this._sizeX && y < this._sizeY) {
            this._grid[x][y] = client;
            return true;
        } else return false; // ToDo Someone is cheating
    }

}
