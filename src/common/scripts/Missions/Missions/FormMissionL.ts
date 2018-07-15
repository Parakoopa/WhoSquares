import {FormMission} from "../FormMission";

export class FormMissionL extends FormMission {

    /**
     * @returns {string}
     */
    public description(): string {
        return "Create a L!";
    }

    /**
     * @returns {string}
     */
    public name(): string {
        return "Form L";
    }

    /**
     * @returns {string}
     */
    public imgpath(): string {
        return "../../../img/mission_L.png";
    }

    /**
     * @returns {number[][]}
     */
    public getForm(): number[][] {
        return [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3], [1, 3], [2, 3], [3, 3],
        ];
    }
}
