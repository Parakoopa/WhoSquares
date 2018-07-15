import Socket = SocketIOClient.Socket;
import {ILoginUI} from "../../ui/interfaces/ILoginUI";
import {ResponseManager} from "../communication/receiver/ResponseManager";
import {LocalPlayer} from "../entity/LocalPlayer/LocalPlayer";

export class Login {

    /**
     *
     * @param {ILoginUI} _ui
     * @param {LocalPlayer} _localPlayer
     */
    constructor(private _ui: ILoginUI, private _localPlayer: LocalPlayer = null) {
        ResponseManager.createLoginListener(this);
    }

    /**
     * Create a single local Player which represents the Client in rooms/games
     * Create RequestEmitter, as requests always involve a connected local player
     * @param {IPlayer} player
     * @param secretKey
     * @param socket
     */
    public addLocalPlayer(player: IPlayer, secretKey: string, socket: Socket): void {
        this.updateGameInfo("LocalPlayer: " + this._localPlayer.name);
    }

    /**
     * Update displayed game info
     * @param {string} info
     */
    public updateGameInfo(info: string): void {
        this._ui.updateGameInfo(info);
    }
    
}
