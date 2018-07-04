import {FormMission} from "./FormMission";

export class FormMissionSquare extends FormMission {

    public description(): string {
        return "Just create a square with your tile!";
    }

    public name(): string {
        return "Square";
    }

    public imgpath(): string {
        return "img/Mission.jpg";
    }

    public getForm(): number[][] {
        return [
            [0, 0], [1, 0],
            [0, 1], [1, 1]
        ];
    }
}
