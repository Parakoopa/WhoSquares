export class ExpandMission implements IMission {

    private _winPercentage: number = 40;

    public description(): string {
        return "";
    }

    public name(): string {
        return "Capture 40%";
    }

    public imgpath(): string {
        return "img/Mission.jpg";
    }

    public check(player: IPlayer, grid: IPlayer[][]): boolean {
        let tileCount: number = 0;

        for (const row of grid) {
            for (const tilePlayer of row) {
                if (tilePlayer === player) tileCount++;
            }
        }
        const gridSize = grid.length * grid[0].length;
        return tileCount * 100.0 / gridSize >= this._winPercentage;
    }

}
