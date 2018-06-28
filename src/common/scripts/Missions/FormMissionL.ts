import {FormMission} from "./FormMission";

export class FormMissionL extends FormMission {

    public description(): string {
        return "Just create a L with your tiled!";
    }

    public name(): string {
        return "Form L";
    }

    public getForm(): number[][] {
        return [
            [0, 0],
            [0, 1],
            [0, 2], [1, 2],
        ];
    }
}
