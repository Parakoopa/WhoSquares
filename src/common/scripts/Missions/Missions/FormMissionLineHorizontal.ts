import {FormMission} from "../FormMission";

export class FormMissionLineHorizontal extends FormMission {

    /**
     * @returns {string}
     */
    public description(): string {
        return "Create a horizontal line!";
    }

    /**
     * @returns {string}
     */
    public name(): string {
        return "Horizontal line";
    }

    /**
     * @returns {string}
     */
    public imgpath(): string {
        return "../../../img/mission_Horizontal.png";
    }

    /**
     * @returns {number[][]}
     */
    public getForm(): number[][] {
        return [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
        ];
    }
}
