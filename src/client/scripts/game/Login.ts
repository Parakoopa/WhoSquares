import Socket = SocketIOClient.Socket;
import {ILoginUI} from "../ui/interfaces/ILoginUI";
import {InputManager} from "./InputManager";
import {LocalPlayer} from "./LocalPlayer";

export class Login {

    public _inputManager: InputManager;
    constructor(private _ui: ILoginUI, private _localPlayer: LocalPlayer = null) {
    }

    // ToDo move
    public startGame(): void {
        this._inputManager.startGame();
    }
    public leaveRoom(): void {
        this._inputManager.leaveRoom();
    }

    /**
     * Create a single local Player which represents the Client in rooms/games
     * Create RequestEmitter, as requests always involve a connected local player
     * @param {IPlayer} player
     * @param secretKey
     * @param socket
     */
    public addLocalPlayer(player: IPlayer, secretKey: string, socket: Socket): void {
        this._localPlayer = new LocalPlayer(player, secretKey);
        this.updateGameInfo("LocalPlayer: " + this._localPlayer.name);
    }

    // Todo make called seperately from outside
    public createRequestEmitter(socket: Socket) {
        this._inputManager.createRequestEmitter(socket, this._localPlayer);
    }

    public updateGameInfo(info: string): void {
        this._ui.updateGameInfo(info);
    }

}
