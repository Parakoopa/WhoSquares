import Game = Phaser.Game;
import {RequestEmitter} from "./RequestEmitter";
import Socket = SocketIOClient.Socket;
import {LocalPlayer} from "./LocalPlayer";

export class InputManager {

    constructor(private _game: Game, private _requestEmitter: RequestEmitter = null) {
        _game.input.mouse.capture = true;
    }

    public createRequestEmitter(socket:Socket, localPlayer: LocalPlayer) {
        this._requestEmitter = new RequestEmitter(socket, localPlayer);
    }

    public checkMouse() {
        if (this._game.input.activePointer.leftButton.onDown) {
            // example
        }
    }

    public joinRoom(roomName: string): void {
        this._requestEmitter.joinRoom(roomName);
    }

    public leaveRoom(): void {
        this._requestEmitter.leaveRoom();
    }

    public startGame() {
        // ToDo Add InputFields to set sizeX & sizeY
        this._requestEmitter.startGame(5, 5);
    }

    public placeTile(x: number, y: number): void {
        this._requestEmitter.placeTile(x, y);
    }

    public debug(): void {
        this._game.debug.text("Left Button: " +
            this._game.input.activePointer.leftButton.isDown, 0, 150);
        this._game.debug.text("Middle Button: " +
            this._game.input.activePointer.middleButton.isDown, 0, 175);
        this._game.debug.text("Right Button: " +
            this._game.input.activePointer.rightButton.isDown, 0, 200);
    }

}
