import {FormMissionCircle} from "../../../../common/scripts/Missions/Missions/FormMissionCircle";
import {FormMissionL} from "../../../../common/scripts/Missions/Missions/FormMissionL";
import {FormMissionLineHorizontal} from "../../../../common/scripts/Missions/Missions/FormMissionLineHorizontal";
import {FormMissionLineVertical} from "../../../../common/scripts/Missions/Missions/FormMissionLineVertical";
import {FormMissionT} from "../../../../common/scripts/Missions/Missions/FormMissionT";
import {Cover15Mission} from "../../../../common/scripts/Missions/Missions/Cover15Mission";
import {ConnectEdges} from "../../../../common/scripts/Missions/Missions/ConnectEdges";
import {ConnectTwoEdgesAnyColor} from "../../../../common/scripts/Missions/Missions/ConnectTwoEdgesAnyColor";

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
        // TODO: I noticed that this is broken. You can't do anything to prevent this goal.
        //this._missions.push(new ConnectTwoEdgesAnyColor());
    }

    /**
     * return a random mission from the pool
     * @returns {IMission}
     */
    public getMission(): IMission {
        return this._missions[Math.floor(Math.random() * this._missions.length)];
    }
}
