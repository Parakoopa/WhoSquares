import {ExpandMission} from "../../../../common/scripts/Missions/ExpandMission";

export class MissionDistributer {

    private readonly _missions: IMission[];

    constructor() {
        this._missions = [];
        this._missions.push(new ExpandMission());
    }

    public getMission(): IMission {
        return this._missions[Math.floor(Math.random() * this._missions.length)];
    }


}
