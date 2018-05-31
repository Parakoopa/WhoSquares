import {Client} from "./Client";

export class ColorDistributer {

    private _clientColorMap: Map<string, Client>;
    private readonly _colors: string[] =
        ["FF3333", "FF9933", "FFFF33", "00FF00", "33FFFF", "9933FF", "FF33FF", "FF3399", "FF33FF"];
        // ["red", "orange", "yellow", "green", "lightblue", "darkblue", "purple", "pink", ToDo "grey", "black", "white"];

    constructor() {
        this._clientColorMap = new Map();
        this.setColors();
    }

    /**
     * Initialize all available color
     * => Somehow add them on definition of _clientColorMap!
     * @constructor
     */
    private setColors(): void {
        for (const color of this._colors) {
            this._clientColorMap.set(color, null);
        }
    }

    /**
     * Return a color not used by any client in this room
     * @returns {string}
     * @constructor
     */
    public setClientColor(client: Client): string {
        for (const color of Array.from(this._clientColorMap.keys())) {
            if (this._clientColorMap.get(color) === null) {
                this._clientColorMap.set(color, client);
                client.setColor(color);
                return color;
            }
        }
        return null;
    }

    /**
     * Makes a color available again
     * @param {Client} client
     * @constructor
     */
    public resetColor(client: Client): void {
        const color: string = client.getColor();
        client.setColor(null);
        this._clientColorMap.set(color, null);
    }

}
