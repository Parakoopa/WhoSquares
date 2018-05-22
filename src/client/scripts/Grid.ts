import Game = Phaser.Game;

export class Grid {

    private readonly _sizeX: number;
    private readonly _sizeY: number;
    private readonly _cellSize: number;

    /**
     * Clients are talked to via socket and identified via unique id guid
     * @param sizeX
     * @param sizeY
     * @param cellSize
     */
    constructor(sizeX: number, sizeY: number, cellSize: number) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._cellSize = cellSize;

    }

    /**
     * Creates a grid of image tiles
     * @param {Phaser.Game} game
     * @param imageName
     * @constructor
     */
    public CreateGrid(game: Game, imageName: string): void {
        const group = game.add.group();
        //  Creates x sprites for each frame (a frame is basically a row)
        group.createMultiple(this._sizeX, imageName, this.CreateFrame(this._sizeY), true);
        //  Align the sprites into rows of x, by however many we need (the -1 argument)
        //  With 40x40 pixel spacing per sprite
        group.align(this._sizeX, -1, this._cellSize,  this._cellSize);
        const offset = this._sizeX * this._cellSize / 2.0;
        group.x = game.world.centerX - offset;
        group.y = game.world.centerY - offset;

    }

    /**
     * An simple int array
     * @param {number} size
     * @returns {number[]}
     * @constructor
     */
    private CreateFrame(size: number) {
        const frame = Array<number>();
        for (let i = 0; i < size ; i++) {
            frame.push(i);
        }
        return frame;
    }

}
