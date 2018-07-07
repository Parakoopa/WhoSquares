import {FormMission} from "./FormMission";

export class FormMissionSquare extends FormMission {

    public description(): string {
        return "Create a square!";
    }

    public name(): string {
        return "Square";
    }

    public imgpath(): string {
        return "../../../img/mission_Square.png";
    }

    public getForm(): number[][] {
        return [
            [0, 0], [1, 0],
            [0, 1], [1, 1]
        ];
    }
}
