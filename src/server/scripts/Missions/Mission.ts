import {Client} from "../Client";
import {ServerGrid} from "../ServerGrid";

export class Mission {

    constructor() {
        if (new.target === Mission) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    public check(client: Client, grid: ServerGrid): boolean {
        throw new Error("You have to implement the method checkMission!");
    }

}
