import {Room} from "../../components/Room";

/**
 * Represents the client in a room
 * Stores all necessary values
 */
export class LocalPlayer {

    private _mission: IMission;
    private _room: Room;
    private _isRoomOwner: boolean;

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

    /**
     *
     * @returns {IPlayer}
     */
    public get player(): IPlayer {
        return this._player;
    }

    /**
     *
     * @returns {string}
     */
    public get name(): string {
        return this._player.name;
    }

    /**
     *
     * @param {string} val
     */
    public set name(val: string) {
        this._player.name = val;
    }

    /**
     *
     * @returns {number}
     */
    public get color(): number {
        return this._player.color;
    }

    /**
     *
     * @param {number} val
     */
    public set color(val: number) {
        this._player.color = val;
    }

    /**
     *
     * @returns {string}
     */
    public get key(): string {
        return this._key;
    }

    /**
     *
     * @returns {IMission}
     */
    public get mission(): IMission {
        return this._mission;
    }

    /**
     *
     * @param {IMission} val
     */
    public set mission(val: IMission) {
        this._mission = val;
    }

    /**
     *
     * @returns {Room}
     */
    public get room(): Room {
        return this._room;
    }

    /**
     *
     * @param {Room} val
     */
    public set room(val: Room) {
        this._room = val;
    }

    /**
     *
     * @returns {boolean}
     */
    public get isRoomOwner(): boolean {
        return this._isRoomOwner;
    }

    /**
     *
     * @param {boolean} val
     */
    public set isRoomOwner(val: boolean) {
        this._isRoomOwner = val;
    }
}
