import {ExpandMission} from "../../../../common/scripts/Missions/ExpandMission";
import {FormMissionCircle} from "../../../../common/scripts/Missions/FormMissionCircle";
import {FormMissionL} from "../../../../common/scripts/Missions/FormMissionL";
import {FormMissionLineHorizontal} from "../../../../common/scripts/Missions/FormMissionLineHorizontal";
import {FormMissionLineVertical} from "../../../../common/scripts/Missions/FormMissionLineVertical";
import {FormMissionSquare} from "../../../../common/scripts/Missions/FormMissionSquare";
import {FormMissionT} from "../../../../common/scripts/Missions/FormMissionT";

/**
 * Stores and hands out missions
 */
export class MissionDistributer {

    private readonly _missions: IMission[];

    /**
     * Add missions to the missionpool
     */
    constructor() {
        this._missions = [];
        this._missions.push(new ExpandMission());
        this._missions.push(new FormMissionCircle());
        this._missions.push(new FormMissionL());
        this._missions.push(new FormMissionLineHorizontal());
        this._missions.push(new FormMissionLineVertical());
        this._missions.push(new FormMissionSquare());
        this._missions.push(new FormMissionT());
    }

    /**
     * return a random mission from the pool
     * @returns {IMission}
     */
    public getMission(): IMission {
        return this._missions[Math.floor(Math.random() * this._missions.length)];
    }
}
