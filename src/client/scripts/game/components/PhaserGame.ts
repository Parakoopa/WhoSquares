import Game = Phaser.Game;
import World = Phaser.World;
import game = PIXI.game;

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
        const width = document.getElementById("game").clientWidth;
        const height = document.getElementById("game").clientHeight;
        const self = this;

        this._loaded = new Promise((resolve, reject) => {
            this._game = new Phaser.Game(width, height, Phaser.AUTO, "game", {
                preload() {
                    this.scale.pageAlignHorizontally = true;
                    this.scale.pageAlignVertically = true;
                    this.load.image("gridTile", "./img/square32_grey.png");
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
