import {Player} from "./Player";

export class ColorDistributer {

    private _playerColorMap: Map<string, Player>;
    private readonly _colors: string[] =
        ["FF3333", "FF9933", "FFFF33", "00FF00", "33FFFF", "9933FF", "FF33FF", "FF3399", "FF33FF"];
        // ["red", "orange", "yellow", "green", "lightblue", "darkblue", "purple", "pink", ToDo "grey", "black", "white"];

    constructor() {
        this._playerColorMap = new Map();
        this.setColors();
    }

    /**
     * Initialize all available color
     * => Somehow add them on definition of _playerColorMap!
     * @constructor
     */
    private setColors(): void {
        for (const color of this._colors) {
            this._playerColorMap.set(color, null);
        }
    }

    /**
     * Return a color not used by any player in this room
     * @returns {string}
     * @constructor
     */
    public setPlayerColor(player: Player): string {
        for (const color of Array.from(this._playerColorMap.keys())) {
            if (this._playerColorMap.get(color) === null) {
                this._playerColorMap.set(color, player);
                player.color = color;
                return color;
            }
        }
        return null;
    }

    /**
     * Makes a color available again
     * @param {Player} player
     * @constructor
     */
    public resetColor(player: Player): void {
        const color: string = player.color;
        player.color = null;
        this._playerColorMap.set(color, null);
    }

}
