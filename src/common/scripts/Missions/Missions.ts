import {ExpandMission} from "./ExpandMission";
import {FormMissionCircle} from "./FormMissionCircle";
import {FormMissionL} from "./FormMissionL";
import {FormMissionLineHorizontal} from "./FormMissionLineHorizontal";
import {FormMissionLineVertical} from "./FormMissionLineVertical";
import {FormMissionSquare} from "./FormMissionSquare";
import {FormMissionT} from "./FormMissionT";

export class Missions {

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
