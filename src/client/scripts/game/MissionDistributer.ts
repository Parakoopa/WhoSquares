import {ExpandMission} from "../../../common/scripts/Missions/ExpandMission";
import {FormMissionCircle} from "../../../common/scripts/Missions/FormMissionCircle";
import {FormMissionL} from "../../../common/scripts/Missions/FormMissionL";
import {FormMissionLineHorizontal} from "../../../common/scripts/Missions/FormMissionLineHorizontal";
import {FormMissionLineVertical} from "../../../common/scripts/Missions/FormMissionLineVertical";
import {FormMissionSquare} from "../../../common/scripts/Missions/FormMissionSquare";
import {FormMissionT} from "../../../common/scripts/Missions/FormMissionT";

export class MissionDistributer {

    // ToDo somehow get rid of getMission and use dependency injection
    /**
     * Returns a IMission instance based on name of class
     * @param {string} missionName
     * @returns {IMission}
     */
    public static getMission(missionName: string): IMission {
       switch (missionName) {
           case "ExpandMission":
               return new ExpandMission();
           case "FormMissionCircle":
               return new FormMissionCircle();
           case "FormMissionL":
               return new FormMissionL();
           case "FormMissionLineHorizontal":
               return new FormMissionLineHorizontal();
           case "FormMissionLineVertical":
               return new FormMissionLineVertical();
           case "FormMissionSquare":
               return new FormMissionSquare();
           case "FormMissionT":
               return new FormMissionT();

       }
       return undefined;
    }

}
