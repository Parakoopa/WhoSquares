import {Room} from "./Room";

export class LocalPlayer {
    private _mission: IMission;

    /**
     * Represents the Client in rooms & games
     * Locally the player can only be in one room at a time
     * IPlayer is located in /common directory
     * @param _player
     * @param _key
     * @param _room
     */
    constructor(
        private _player: IPlayer,
        private _key: string,
        private _room: Room = null
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

    public get room(): Room {
        return this._room;
    }

    public set room(val: Room) {
        this._room = val;
    }

    public get mission(): IMission {
        return this._mission;
    }

    public set mission(val: IMission) {
        this._mission = val;
    }

    /**
     * Create new local Room and assign it to player
     * @param {IJoinedResponse} resp
     */
    public joinedRoom(resp: IJoinedResponse): void {
        this._room = new Room(
            resp.roomKey,
            resp.roomName,
            resp.otherPlayers
        );
        this.color = resp.color;
    }

    /**
     * Tell room do destroy grid and delete room
     */
    public leftRoom(): void {
        this._room.destroyGrid();
        this._room = null;
    }
}
