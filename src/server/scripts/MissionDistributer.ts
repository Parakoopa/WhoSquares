import {Client} from "./Client";
import {ExpandMission} from "./Missions/ExpandMission";
import {Mission} from "./Missions/Mission";

export class MissionDistributer {

    private readonly _missions: Mission[];

    constructor() {
        this._missions = [];
        this._missions.push(new ExpandMission());
    }


    public setMission(client: Client): void {
        client.mission =  this._missions[Math.floor(Math.random() * this._missions.length)];
    }

    public resetMission(client: Client): void {
        client.mission = null;
    }

}
