import {Client} from "../../Client/Client";

export class ColorDistributer {

    private _clientColorMap: Map<number, Client>;
    private readonly _colors: number[] = [
           parseInt("FF3333", 16), // red
           parseInt("FF9933", 16), // orange
           parseInt("FFFF33", 16), // yellow
           parseInt("00FF00", 16), // green
           parseInt("33FFFF", 16), // lightblue
           parseInt("9933FF", 16), // darkblue
           parseInt("FF33FF", 16), // purple
           parseInt("FF3399", 16), // pink
           parseInt("FF33FF", 16), // grey?
            // Todo grey, black, white
        ];

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
    public setClientColor(client: Client): number {
        for (const color of Array.from(this._clientColorMap.keys())) {
            if (this._clientColorMap.get(color) === null) {
                this._clientColorMap.set(color, client);
                client.color = color;
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
        const color: number = client.color;
        client.color = null;
        this._clientColorMap.set(color, null);
    }

}
