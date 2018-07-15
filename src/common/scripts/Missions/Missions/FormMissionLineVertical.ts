import {FormMission} from "../FormMission";

export class FormMissionLineVertical extends FormMission {

    /**
     * @returns {string}
     */
    public description(): string {
        return "Create a vertical line!";
    }

    /**
     * @returns {string}
     */
    public name(): string {
        return "Vertical line";
    }

    /**
     * @returns {string}
     */
    public imgpath(): string {
        return "../../../img/mission_Vertical.png";
    }

    /**
     * @returns {number[][]}
     */
    public getForm(): number[][] {
        return [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
            [0, 5],
            [0, 6],
            [0, 7],
        ];
    }
}
