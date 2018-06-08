import {Room} from "./Room";

export class LocalPlayer implements IPlayer {

    /**
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

    public get color(): string {
        return this._player.color;
    }

    public set color(val: string) {
        this._player.color = val;
    }

    public get key(): string {
        return this._key;
    }

    public get room(): Room {
        return this._room;
    }

    public set room(val: Room){
        this._room = val;
    }

    public getColorHex(): number {
        console.log("color: "+ this._player.color);
        return  parseInt(this._player.color, 16);
    }

    /**
     *
     * @param {IRoomIsFullResponse | IJoinedResponse} resp
     */
    public joinedRoom(resp: IJoinedResponse): void {
        this._room = new Room(
            resp.roomKey,
            resp.roomName,
            resp.otherPlayers
        );
        this.color = resp.color;
    }

    public leftRoom(): void {
        this._room.destroyGrid();
        this._room = null;
    }
}
