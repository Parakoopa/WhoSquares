export class OtherPlayer implements IPlayer {

    /**
     * @param _player
     */
    constructor(private _player: IPlayer) {}

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

    public getColorHex(): number {
        return  parseInt(this._player.color, 16);
    }
}
