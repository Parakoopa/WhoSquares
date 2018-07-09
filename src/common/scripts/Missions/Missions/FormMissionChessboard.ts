import {FormMission} from "../FormMission";

export class FormMissionChessboard extends FormMission {

    public description(): string {
        return "Have a 4x4 chessboard structure like shown in the picture!";
    }

    public name(): string {
        return "Chessboard";
    }

    public imgpath(): string {
        return "../../../img/mission_T.png";
    }

    public getForm(): number[][] {
        return [
            [0, 0]        , [2, 0],
                    [1, 1]        , [3, 1],
            [0, 2]        , [2, 2],
                    [1, 3]        , [3, 3]
        ];
    }
}
