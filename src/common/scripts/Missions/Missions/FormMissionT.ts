import {FormMission} from "../FormMission";

export class FormMissionT extends FormMission {

    public description(): string {
        return "Create a T!";
    }

    public name(): string {
        return "Form T";
    }

    public imgpath(): string {
        return "../../../img/mission_T.png";
    }

    public getForm(): number[][] {
        return [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
                            [1, 1],
                            [1, 2],
                            [1, 3],
        ];
    }
}
