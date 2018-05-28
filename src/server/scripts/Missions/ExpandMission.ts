import {Client} from "../Client";
import {ServerGrid} from "../ServerGrid";
import {Mission} from "./Mission";

export class ExpandMission extends Mission {

    private _winPercentage: number = 40;

    public check(client: Client, grid: ServerGrid): boolean {
        let tileCount: number = 0;

        for (const row of grid.grid) {
            for (const tileClient of row) {
                if (tileClient === client) tileCount++;
            }
        }
        return tileCount * 100.0 / grid.size >= this._winPercentage;
    }
}
