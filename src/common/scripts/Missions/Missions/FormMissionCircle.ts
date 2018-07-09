import {FormMission} from "../FormMission";

export class FormMissionCircle extends FormMission {

    public description(): string {
        return "Create a circle!";
    }

    public name(): string {
        return "Form Circle";
    }

    public imgpath(): string {
        return "../../../img/mission_Circle.png";
    }

    public getForm(): number[][] {
        return [
            [0, 0], [1, 0], [2, 0],
            [0, 1],         [2, 1],
            [0, 2], [1, 2], [2, 2],
        ];
    }
}
