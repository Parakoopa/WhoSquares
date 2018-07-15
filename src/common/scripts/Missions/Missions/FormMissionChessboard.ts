import {FormMission} from "../FormMission";

export class FormMissionChessboard extends FormMission {

    /**
     * @returns {string}
     */
    public description(): string {
        return "Have a 4x4 chessboard structure like shown in the picture!";
    }

    /**
     * @returns {string}
     */
    public name(): string {
        return "Chessboard";
    }

    /**
     * @returns {string}
     */
    public imgpath(): string {
        return "../../../img/mission_Chessboard.png";
    }

    /**
     * @returns {number[][]}
     */
    public getForm(): number[][] {
        return [
            [0, 0]        , [2, 0],
                    [1, 1]        , [3, 1],
            [0, 2]        , [2, 2],
                    [1, 3]        , [3, 3]
        ];
    }
}
