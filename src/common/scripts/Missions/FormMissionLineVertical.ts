import {FormMission} from "./FormMission";

export class FormMissionLineVertical extends FormMission {

    public description(): string {
        return "Just create a vertical line!";
    }

    public name(): string {
        return "Vertical line";
    }

    public imgpath(): string {
        return "img/Mission.jpg";
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
