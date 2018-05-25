/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
 */
import {Client} from "./Client";

export class ServerGrid {

    private _sizeX: number;
    private _sizeY: number;
    private _grid: any[][];

    constructor(sizeX: number, sizeY: number) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this.createGrid(sizeX, sizeY);
    }

    private createGrid(sizeX: number, sizeY: number): void {
        const client: Client = null; // default Value
        this._grid = [...Array(sizeY)].map((e) => Array(sizeX).fill(client));
    }

    public placeTile(client: Client, x: number, y: number): boolean {
        if (x < this._sizeX && y < this._sizeY) {
            this._grid[x][y] = client;
            return true;
        } else return false; // ToDo Someone is cheating
    }

}
