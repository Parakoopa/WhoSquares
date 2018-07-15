import {FormMission} from "../FormMission";

export class FormMissionT extends FormMission {

    /**
     * @returns {string}
     */
    public description(): string {
        return "Create a T!";
    }

    /**
     * @returns {string}
     */
    public name(): string {
        return "Form T";
    }

    /**
     * @returns {string}
     */
    public imgpath(): string {
        return "../../../img/mission_T.png";
    }

    /**
     * @returns {number[][]}
     */
    public getForm(): number[][] {
        return [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
                            [1, 1],
                            [1, 2],
                            [1, 3],
        ];
    }
}
