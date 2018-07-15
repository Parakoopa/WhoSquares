import {CoverMission} from "../CoverMission";

export class Cover15Mission extends CoverMission {

    /**
     * @returns {string}
     */
    public description(): string {
        return "Cover 15% of the Grid";
    }

    /**
     * @returns {string}
     */
    public imgpath(): string {
        return "../../../img/mission_15percent.png";
    }

    /**
     * @returns {string}
     */
    public name(): string {
        return "Cover 15%";
    }

    /**
     * @returns {number}
     */
    protected getWinPercentage(): number {
        return 15;
    }
}
