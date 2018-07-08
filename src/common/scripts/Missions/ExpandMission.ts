export class ExpandMission implements IMission {

    private _winPercentage: number = 40;

    public description(): string {
        return "";
    }

    public name(): string {
        return "Capture 40% of the grid!";
    }

    public imgpath(): string {
        return "../../../img/mission_40percent.png";
    }

    public check(localPlayer: IPlayer, grid: IPlayer[][]): ITile[] {
        let tileCount: number = 0;
        const winTiles: ITile[] = [];
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const player = grid[y][x];
                if (player === localPlayer) {
                    tileCount++;
                    winTiles.push({x, y});
                }
            }
        }
        const gridSize = grid.length * grid[0].length;
        if (tileCount * 100.0 / gridSize >= this._winPercentage) return winTiles;
        else return [];
    }

}
