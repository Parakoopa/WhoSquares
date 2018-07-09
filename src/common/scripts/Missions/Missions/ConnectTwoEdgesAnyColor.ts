import {ConnectEdges} from "./ConnectEdges";
import {Helper} from "../Helper";

export class ConnectTwoEdgesAnyColor extends ConnectEdges {
    public description(): string {
        return "Connect the left edge of the grid with the right one " +
            "and the top edge with the bottom edge using any player's colors.";
    }
    public name(): string {
        return "Connect all edges (any colors)";
    }
    public imgpath(): string {
        return "../../../img/mission_2edges_any_color.png";
    }

    public check(player: IPlayer, grid: IPlayer[][]): ITile[] {
        let i;
        const gridHeight = grid.length;
        const gridWidth = grid[0].length;
        let winTiles: ITile[] = [];
        let winTiles2: ITile[] = [];

        // Check left right
        for (i = 0; i < gridHeight; i++) {
            if (!grid[i][0]) continue;
            winTiles = this.longestPathLR(((p) => p != null), grid, i, 0, []);
            if (winTiles.length === gridHeight) break;
        }
        if (winTiles.length !== gridHeight) return []; // Left right not successful

        // Check top bottom
        for (i = 0; i < gridWidth; i++) {
            if (!grid[0][i]) continue;
            winTiles2 = this.longestPathTB(((p) => p != null), grid, i, 0, []);
            if (winTiles2.length === gridWidth) break;
        }
        if (winTiles2.length !== gridWidth) return []; // Top bottom not successful

        // Both sides connect, return winning tiles
        // TODO remove duplicate win tiles
        return winTiles.concat(winTiles2);
    }
}