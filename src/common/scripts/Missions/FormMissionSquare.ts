import {FormMission} from "./FormMission";

export class FormMissionSquare extends FormMission {

    public description(): string {
        return "Just create a circle with your tiled!";
    }

    public name(): string {
        return "Form Circle";
    }

    public getForm(): number[][] {
        return [
            [0, 0], [1, 0],
            [0, 1], [1, 1]
        ];
    }
}
