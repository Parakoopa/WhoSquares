import {FormMission} from "./FormMission";

export class FormMissionLineHorizontal extends FormMission {

    public description(): string {
        return "Just create a horizontal line!";
    }

    public name(): string {
        return "Horizontal line";
    }

    public imgpath(): string {
        return "img/Mission.jpg";
    }

    public getForm(): number[][] {
        return [
            [0, 0], [1, 0], [2, 0], [3, 0],
        ];
    }
}
