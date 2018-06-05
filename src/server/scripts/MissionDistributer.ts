import {ExpandMission} from "../../common/scripts/Missions/ExpandMission";
import {Player} from "./Player";

export class MissionDistributer {

    private readonly _missions: IMission[];

    constructor() {
        this._missions = [];
        this._missions.push(new ExpandMission());
    }

    public setMission(player: Player): void {
        player.mission = this._missions[Math.floor(Math.random() * this._missions.length)];
    }

    public resetMission(player: Player): void {
        player.mission = null;
    }

}
