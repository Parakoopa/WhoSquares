import {FormMission} from "../FormMission";

export class FormMissionL extends FormMission {

    public description(): string {
        return "Create a L!";
    }

    public name(): string {
        return "Form L";
    }

    public imgpath(): string {
        return "../../../img/mission_L.png";
    }

    public getForm(): number[][] {
        return [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3], [1, 3], [2, 3], [3, 3],
        ];
    }
}
