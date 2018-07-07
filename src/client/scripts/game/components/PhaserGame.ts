import Game = Phaser.Game;
import World = Phaser.World;

export class PhaserGame {

    private readonly _game: Game;

    /**
     * Create Room, Layout Room, Load Images
     * Initialize UiManager
     * Initialize ResponseReceiver
     * Start UpdateLoop (Client only Updates UI & Logic stuff only by Server Events)
     */
    constructor() {
        const width = document.getElementById("game").clientWidth;
        const height = document.getElementById("game").clientHeight;

        const game = new Phaser.Game(width, height, Phaser.AUTO, "game", {
            preload() {
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.load.image("gridTile", "./img/square32_grey.png");
            },
            create() {

            }
        }, true);
        this._game = game;
    }

    public get game(): Game {
        return this._game;
    }
}
