export class Client implements IClient {

    _name: string;
    _color: string;

    constructor(name: string, color: string) {
        this._name = name;
        this._color = color;
    }

    public getName(): string {
        return this._name;
    }

    public getColorHex(): number {
        return  parseInt(this._color, 16);
    }

    public getColor(): string {
        return this._color;
    }

    public setColor(val: string): void {
        this._color = val;
    }

}
