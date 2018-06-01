export class ExpandMission implements IMission {

    private _winPercentage: number = 40;

    public description(): string {
        return "";
    }

    public name(): string {
        return "";
    }

    public check(client: IClient, grid: IClient[][]): boolean {
        let tileCount: number = 0;

        for (const row of grid) {
            for (const tileClient of row) {
                if (tileClient === client) tileCount++;
            }
        }
        const gridSize = grid.length * grid[0].length;
        return tileCount * 100.0 / gridSize >= this._winPercentage;
    }

}
