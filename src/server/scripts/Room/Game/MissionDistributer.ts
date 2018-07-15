import {ConnectEdges} from "../../../../common/scripts/Missions/Missions/ConnectEdges";
import {Cover15Mission} from "../../../../common/scripts/Missions/Missions/Cover15Mission";
import {FormMissionCircle} from "../../../../common/scripts/Missions/Missions/FormMissionCircle";
import {FormMissionL} from "../../../../common/scripts/Missions/Missions/FormMissionL";
import {FormMissionLineHorizontal} from "../../../../common/scripts/Missions/Missions/FormMissionLineHorizontal";
import {FormMissionLineVertical} from "../../../../common/scripts/Missions/Missions/FormMissionLineVertical";
import {FormMissionT} from "../../../../common/scripts/Missions/Missions/FormMissionT";

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
        this._missions.push(new Cover15Mission());
        this._missions.push(new FormMissionCircle());
        this._missions.push(new FormMissionL());
        this._missions.push(new FormMissionLineHorizontal());
        this._missions.push(new FormMissionLineVertical());
        this._missions.push(new FormMissionT());
        this._missions.push(new ConnectEdges());
    }

    /**
     * return a random mission from the pool
     * @returns {IMission}
     */
    public getMission(): IMission {
        return this._missions[Math.floor(Math.random() * this._missions.length)];
    }
}
