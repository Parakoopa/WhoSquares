import {FormMission} from "./FormMission";

export class FormMissionLineHorizontal extends FormMission {

    public description(): string {
        return "Just create a circle with your tiled!";
    }

    public name(): string {
        return "Form Circle";
    }

    public getForm(): number[][] {
        return [
            [0, 0], [1, 0], [2, 0], [3, 0],
        ];
    }
}
