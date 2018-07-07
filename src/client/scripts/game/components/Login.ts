import Socket = SocketIOClient.Socket;
import {ILoginUI} from "../../ui/interfaces/ILoginUI";
import {RequestEmitter} from "../Emitter/RequestEmitter";
import {RequestManager} from "../Emitter/RequestManager";
import {LocalPlayer} from "../LocalPlayer";
import {ResponseManager} from "../ResponseManager/ResponseManager";

export class Login {

    private _requestEmitter: RequestEmitter;

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
        this._localPlayer = new LocalPlayer(player, secretKey);
        this._requestEmitter = RequestManager.createRequestEmitter(socket, this._localPlayer);
        this.updateGameInfo("LocalPlayer: " + this._localPlayer.name);
    }

    public updateGameInfo(info: string): void {
        this._ui.updateGameInfo(info);
    }
    
}
