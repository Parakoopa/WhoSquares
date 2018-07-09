import {CoverMission} from "../CoverMission";

export class Cover15Mission extends CoverMission {
    public description(): string {
        return "Cover 15% of the Grid";
    }
    public imgpath(): string {
        return "../../../img/mission_15percent.png";
    }

    public name(): string {
        return "Cover 15%";
    }

    protected getWinPercentage(): number {
        return 15;
    }
}
