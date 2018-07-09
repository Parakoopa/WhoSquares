export abstract class CoverMission implements IMission {

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
        if (tileCount * 100.0 / gridSize >= this.getWinPercentage()) return winTiles;
        else return [];
    }

    public abstract description(): string;

    public abstract imgpath(): string;

    public abstract name(): string;

    protected abstract getWinPercentage(): number;

}
