import {Room} from "./Room";

export class LocalPlayer {
    private _mission: IMission;

    /**
     * Represents the Client in rooms & games
     * Locally the player can only be in one room at a time
     * IPlayer is located in /common directory
     * @param _player
     * @param _key
     */
    constructor(
        private _player: IPlayer,
        private _key: string,
    ) {}

    public get player(): IPlayer {
        return this._player;
    }

    public get name(): string {
        return this._player.name;
    }

    public set name(val: string) {
        this._player.name = val;
    }

    public get color(): number {
        return this._player.color;
    }

    public set color(val: number) {
        this._player.color = val;
    }

    public get key(): string {
        return this._key;
    }

    public get mission(): IMission {
        return this._mission;
    }

    public set mission(val: IMission) {
        this._mission = val;
    }

}
