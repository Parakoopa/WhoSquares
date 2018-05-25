import Game = Phaser.Game;

export class InputManager {

    private _game: Game;

    constructor(game: Game) {
        this._game = game;
        game.input.mouse.capture = true;

    }

    public CheckMouse(){

        if(this._game.input.activePointer.leftButton.onDown){

        }

    }

    public Debug(): void {
        this._game.debug.text("Left Button: " +
            this._game.input.activePointer.leftButton.isDown, 0, 150);
        this._game.debug.text("Middle Button: " +
            this._game.input.activePointer.middleButton.isDown, 0, 175);
        this._game.debug.text("Right Button: " +
            this._game.input.activePointer.rightButton.isDown, 0, 200);
    }

}
