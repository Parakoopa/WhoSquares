import {RequestEmitter} from "../../Emitter/RequestEmitter";
import {PhaserGame} from "../PhaserGame";
import {Grid} from "./Grid";

export class GridFactory {

    private static _phaserGame: PhaserGame;

    /**
     * Recreates a grid that already exists on server side
     * Is owned by room but called here as it consists of ui elements
     * @param {IPlayer[][]} gridInfo
     * @param overColor
     * @param requestEmitter
     * @returns {Grid}
     */
    public static createGridByInfo(gridInfo: IPlayer[][], overColor: number, requestEmitter: RequestEmitter): Grid {
        const grid = this.createGrid(gridInfo[0].length, gridInfo.length, overColor, requestEmitter);
        this.placedTiles(grid, gridInfo);
        return grid;
    }

    /**
     * Used to recreate a grid by assigning all tiles of
     * another 2D grid
     * @param grid
     * @param {IPlayer[][]} gridInfo
     */
    private static placedTiles(grid: Grid, gridInfo: IPlayer[][]) {
        for (let y = 0; y < gridInfo.length; y++) {
            for (let x = 0; x < gridInfo[y].length; x++) {
                grid.placedTile(gridInfo[y][x], y, x);
            }
        }
    }

    /**
     * Create a grid of given image, sizes & color
     * Is owned by room but called here as it consists of ui elements
     * @param {number} sizeX
     * @param {number} sizeY
     * @param overColor
     * @param requestEmitter
     * @returns {Grid}
     */
    public static createGrid(sizeX: number, sizeY: number, overColor: number, requestEmitter: RequestEmitter): Grid {
        // ToDo add Callback
        this._phaserGame = new PhaserGame();
        return new Grid(requestEmitter, overColor, sizeX, sizeY, "gridTile", this._phaserGame.game, 40);
    }

}
