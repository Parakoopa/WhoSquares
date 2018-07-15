import {FormMission} from "../FormMission";

export class FormMissionCircle extends FormMission {

    /**
     * @returns {string}
     */
    public description(): string {
        return "Create a circle!";
    }

    /**
     * @returns {string}
     */
    public name(): string {
        return "Form Circle";
    }

    /**
     * @returns {string}
     */
    public imgpath(): string {
        return "../../../img/mission_Circle.png";
    }

    /**
     * @returns {number[][]}
     */
    public getForm(): number[][] {
        return [
            [0, 0], [1, 0], [2, 0],
            [0, 1],         [2, 1],
            [0, 2], [1, 2], [2, 2],
        ];
    }
}
