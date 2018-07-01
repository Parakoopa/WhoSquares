import Game = Phaser.Game;
import Socket = SocketIOClient.Socket;
import {LocalPlayer} from "./LocalPlayer";
import {RequestEmitter} from "./RequestEmitter";

export class InputManager {

    /**
     * Player input may effect game and/or start a Request on Server
     * @param {Phaser.Game} _game
     * @param {RequestEmitter} _requestEmitter
     */
    constructor(private _game: Game, private _requestEmitter: RequestEmitter = null) {
        _game.input.mouse.capture = true;
    }

    /**
     * InputManager exists before RequestEmitter,
     * thus has to be assigned afterwards
     * @param {SocketIOClient.Socket} socket
     * @param {LocalPlayer} localPlayer
     */
    public createRequestEmitter(socket: Socket, localPlayer: LocalPlayer) {
        this._requestEmitter = new RequestEmitter(socket, localPlayer);
    }

    /**
     * Check Mouse: OnLeftButtonDown
     */
    public checkMouse() {
        if (this._game.input.activePointer.leftButton.onDown) {
            // example
        }
    }

    /**
     * Tell RequestEmitter to join given room
     * @param {string} roomName
     */
    public joinRoom(roomName: string): void {
        this._requestEmitter.joinRoom(roomName);
    }

    /**
     * Tell RequestEmitter to leave given room
     */
    public leaveRoom(): void {
        this._requestEmitter.leaveRoom();
    }

    /**
     * Tell RequestEmitter to start given Room with given sizes
     * ToDo: Connect Sizes to InputFields
     */
    public startGame() {
        this._requestEmitter.startGame(5, 5);
    }

    /**
     * Tell RequestEmitter to place Tile by ths player
     * @param {number} x
     * @param {number} y
     */
    public placeTile(y: number, x: number): void {
        this._requestEmitter.placeTile(y, x);
    }

}
