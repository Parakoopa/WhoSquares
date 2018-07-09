import {RequestManager} from "../../communication/requester/RequestManager";
import {LocalPlayer} from "./LocalPlayer";
import Socket = SocketIOClient.Socket;

export class LocalPlayerManager {

    private static _localPlayer: LocalPlayer;

    public static addLocalPlayer(player: IPlayer, secretKey: string, socket: Socket) {
        this._localPlayer = new LocalPlayer(player, secretKey);
        RequestManager.createRequestEmitter(socket);
    }

    public static getLocalPlayer() {
        return this._localPlayer;
    }

    public static equalsLocalPlayer(player: IPlayer) {
        return this.equalsIPlayer(this._localPlayer.player, player);
    }

    public static equalsIPlayer(p1: IPlayer, p2: IPlayer) {
        if (p1 === p2)
            return true;

        if (p1 && !p2)
            return false;

        if (!p1 && p2)
            return false;

        return p1.name === p2.name && p1.color === p2.color;
    }

}
