import {ExpandMission} from "../../../../common/scripts/Missions/ExpandMission";

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
    }

    /**
     * return a random mission from the pool
     * @returns {IMission}
     */
    public getMission(): IMission {
        return this._missions[Math.floor(Math.random() * this._missions.length)];
    }

}
