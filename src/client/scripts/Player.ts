export class Player implements IPlayer {

    constructor(
        private _name: string,
        private _color: string) {}

    public get name(): string {
        return this._name;
    }

    public get color(): string {
        return this._color;
    }

    public set color(val: string) {
        this._color = val;
    }

    public getColorHex(): number {
        return  parseInt(this._color, 16);
    }
}
