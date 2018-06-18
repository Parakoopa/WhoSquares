
export class ColorDistributer {

    private _clientColorMap: Map<number, boolean>;
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
            this._clientColorMap.set(color, false);
        }
    }

    /**
     * Return a color not used by any client in this room
     * @returns {string}
     * @constructor
     */
    public getFreeColor(): number {
        for (const color of Array.from(this._clientColorMap.keys())) {
            if (!this._clientColorMap.get(color)) {
                this._clientColorMap.set(color, true);
                return color;
            }
        }
        return null;
    }

    /**
     * Makes a color available again
     * @constructor
     * @param color
     */
    public resetColor(color: number): void {
        this._clientColorMap.set(color, null);
    }

}
