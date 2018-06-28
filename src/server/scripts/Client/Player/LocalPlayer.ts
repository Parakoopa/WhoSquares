import {Room} from "../../Room/Room";

/**
 * A wrapper class to add private information to player
 * like f.e. the mission
 */
export class LocalPlayer {

    /**
     * @param _player
     * @param _room
     * @param _mission
     */
    constructor(
        private _player: IPlayer,
        private _room: Room,
        private _mission: IMission
    ) {}

    public get player(): IPlayer {
        return this._player;
    }

    public get mission(): IMission {
        return this._mission;
    }

    public set mission(val: IMission) {
        this._mission = val;
    }
}
