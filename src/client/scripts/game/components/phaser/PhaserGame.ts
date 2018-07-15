import Game = Phaser.Game;

/**
 * Creates Game Canvas, sets scaling, loads images into game.
 * (Asynchron)
 */
export class PhaserGame {

    private _game: Game;
    private readonly _loaded: Promise<Game>;

    /**
     * Create Room, Layout Room, Load Images
     * Initialize UiManager
     * Initialize ResponseReceiver
     * Start UpdateLoop (Client only Updates UI & Logic stuff only by Server Events)
     */
    constructor() {
        const width = document.getElementById("game").clientWidth + 20; // 20 Offset to allow mouse exit events
        const height = document.getElementById("game").clientHeight + 20;  // 20 Offset to allow mouse exit events

        this._loaded = new Promise((resolve, reject) => {
            this._game = new Phaser.Game(width, height, Phaser.AUTO, "game", {
                preload() {
                    this.scale.pageAlignHorizontally = true;
                    this.scale.pageAlignVertically = true;
                    this.load.image("gridTile", "./img/square32_grey.png");
                    this.load.image("winTile", "./img/square32_win.png");
                },
                create() {
                    resolve(this);
                }
            }, true);
        });
    }

    public get game(): Game {
        return this._game;
    }

    public loaded(): Promise<Game> {
        return this._loaded;
    }
}
