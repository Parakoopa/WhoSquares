import {FormMissionCircle} from "./Missions/FormMissionCircle";
import {FormMissionL} from "./Missions/FormMissionL";
import {FormMissionLineHorizontal} from "./Missions/FormMissionLineHorizontal";
import {FormMissionLineVertical} from "./Missions/FormMissionLineVertical";
import {FormMissionT} from "./Missions/FormMissionT";
import {Cover15Mission} from "./Missions/Cover15Mission";
import {ConnectEdges} from "./Missions/ConnectEdges";
import {ConnectTwoEdgesAnyColor} from "./Missions/ConnectTwoEdgesAnyColor";

export class Missions {

    // ToDo somehow get rid of getMission and use dependency injection
    /**
     * Returns a IMission instance based on name of class
     * @param {string} missionName
     * @returns {IMission}
     */
    public static getMission(missionName: string): IMission {
       switch (missionName) {
           case "Cover15Mission":
               return new Cover15Mission();
           case "FormMissionCircle":
               return new FormMissionCircle();
           case "FormMissionL":
               return new FormMissionL();
           case "FormMissionLineHorizontal":
               return new FormMissionLineHorizontal();
           case "FormMissionLineVertical":
               return new FormMissionLineVertical();
           case "FormMissionT":
               return new FormMissionT();
           case "ConnectEdges":
               return new ConnectEdges();
           case "ConnectTwoEdgesAnyColor":
               return new ConnectTwoEdgesAnyColor();

       }
       return undefined;
    }
}
