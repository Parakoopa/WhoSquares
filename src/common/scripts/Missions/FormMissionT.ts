import {FormMission} from "./FormMission";

export class FormMissionT extends FormMission {

    public description(): string {
        return "Just create a T with your tile!";
    }

    public name(): string {
        return "Form T";
    }

    public imgpath(): string {
        return "img/Mission.jpg";
    }

    public getForm(): number[][] {
        return [
            [0, 0], [1, 0], [2, 0],
                    [1, 1],
                    [1, 2],
        ];
    }
}
