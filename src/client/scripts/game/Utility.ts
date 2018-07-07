import {RequestManager} from "./Emitter/RequestManager";
import {LocalPlayer} from "./LocalPlayer";
import Socket = SocketIOClient.Socket;

export class Utility {

    private static _localPlayer: LocalPlayer;

    public static addLocalPlayer(player: IPlayer, secretKey: string, socket: Socket) {
        if (!this._localPlayer) this._localPlayer = new LocalPlayer(player, secretKey);
        RequestManager.createRequestEmitter(socket, this._localPlayer);
    }

    public static getLocalPlayer() {
        return this._localPlayer;
    }
}
