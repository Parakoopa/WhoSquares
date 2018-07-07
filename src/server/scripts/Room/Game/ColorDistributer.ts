import {Player} from "../Player";

export class ColorDistributer {
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

    /**
     * Return a color not used by any client in this room
     * @returns {string}
     * @constructor
     */
    public getFreeColor(clients: Player[]): number {
        const colorsUsed: number[] = clients.map((client) => client.color);
        for (const color of this._colors) {
            if (!colorsUsed.includes(color)) {
                return color;
            }
        }
        return null;
    }
}
