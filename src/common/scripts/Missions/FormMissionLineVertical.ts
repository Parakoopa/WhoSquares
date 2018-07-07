import {FormMission} from "./FormMission";

export class FormMissionLineVertical extends FormMission {

    public description(): string {
        return "Create a vertical line!";
    }

    public name(): string {
        return "Vertical line";
    }

    public imgpath(): string {
        return "../../../img/mission_Vertical.png";
    }

    public getForm(): number[][] {
        return [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
        ];
    }
}
