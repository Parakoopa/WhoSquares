import {ExpandMission} from "../../common/scripts/Missions/ExpandMission";
import {Client} from "./Client";

export class MissionDistributer {

    private readonly _missions: IMission[];

    constructor() {
        this._missions = [];
        this._missions.push(new ExpandMission());
    }

    public setMission(client: Client): void {
        client.setMission(this._missions[Math.floor(Math.random() * this._missions.length)]);
    }

    public resetMission(client: Client): void {
        client.setMission(null);
    }

}
