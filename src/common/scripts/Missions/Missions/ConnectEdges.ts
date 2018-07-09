import {Helper} from "../Helper";

export class ConnectEdges implements IMission {
    public description(): string {
        return "Connect two edges of the grid that are opposite to each other";
    }
    public name(): string {
        return "Connect Edges";
    }
    public imgpath(): string {
        return "../../../img/mission_edges.png";
    }

    public check(player: IPlayer, grid: IPlayer[][]): ITile[] {
        let i;
        const gridHeight = grid.length;
        const gridWidth = grid[0].length;

        // Check left right
        for (i = 0; i < gridHeight; i++) {
            if (!Helper.equalsPlayer(grid[i][0], player)) continue;
            const tiles = this.longestPathLR(((p) => Helper.equalsPlayer(p, player)), grid, i, 0, []);
            if (tiles.length === gridHeight) return tiles;
        }

        // Check top bottom
        for (i = 0; i < gridWidth; i++) {
            if (!Helper.equalsPlayer(grid[0][i], player)) continue;
            const tiles = this.longestPathTB(((p) => Helper.equalsPlayer(p, player)), grid, i, 0, []);
            if (tiles.length === gridWidth) return tiles;
        }

        // Other checks would be redundant.
        return [];
    }

    /**
     * Get's the longest connected path for row Y to the end using only tiles that are further right
     * and connected (either directly or diagonally)
     * @param tileCondition     A function that is given a tile that might connect the line. Can be used to check
     *                          that the line must match the player's color.
     * @param {IPlayer[][]} grid
     * @param {number} y
     * @param {number} currentX
     * @param currentPath   The path that we are currently on in the recursive search
     * @returns {ITile[]}
     */
    protected longestPathLR(
        tileCondition: (player: IPlayer) => boolean, grid: IPlayer[][],
        y: number, currentX: number, currentPath: ITile[]
    ): ITile[] {
        const copyOfCurrentPath = Array.from(currentPath);
        copyOfCurrentPath.push({y, x: currentX});
        // Loop
        const possibleNewPaths = [copyOfCurrentPath];
        if (currentX + 1 < grid[0].length) {
            if (tileCondition(grid[y][currentX + 1])) {
                possibleNewPaths.push(this.longestPathLR(tileCondition, grid, y, currentX + 1, copyOfCurrentPath));
            }
            if (y + 1 < grid.length && tileCondition(grid[y + 1][currentX + 1])) {
                possibleNewPaths.push(this.longestPathLR(tileCondition, grid, y + 1, currentX + 1, copyOfCurrentPath));
            }
            if (y !== 0 && tileCondition(grid[y - 1][currentX + 1])) {
                possibleNewPaths.push(this.longestPathLR(tileCondition, grid, y - 1, currentX + 1, copyOfCurrentPath));
            }
        }
        return possibleNewPaths.sort((a, b) => b.length - a.length)[0];
    }

    /**
     * @see longestPathLR but from top to bottom
     * @todo Collapse into one function
     */
    protected longestPathTB(
        tileCondition: (player: IPlayer) => boolean, grid: IPlayer[][],
        x: number, currentY: number, currentPath: ITile[]
    ): ITile[] {
        const copyOfCurrentPath = Array.from(currentPath);
        copyOfCurrentPath.push({y: currentY, x});
        // Loop
        const possibleNewPaths = [copyOfCurrentPath];
        if (currentY + 1 < grid.length) {
            if (tileCondition(grid[currentY + 1][x])) {
                possibleNewPaths.push(this.longestPathTB(tileCondition, grid, x, currentY + 1, copyOfCurrentPath));
            }
            if (x + 1 < grid[0].length && tileCondition(grid[currentY + 1][x + 1])) {
                possibleNewPaths.push(this.longestPathTB(tileCondition, grid, x + 1, currentY + 1, copyOfCurrentPath));
            }
            if (x !== 0 && tileCondition(grid[currentY + 1][x - 1])) {
                possibleNewPaths.push(this.longestPathTB(tileCondition, grid, x - 1, currentY + 1, copyOfCurrentPath));
            }
        }
        return possibleNewPaths.sort((a, b) => b.length - a.length)[0];
    }
}
