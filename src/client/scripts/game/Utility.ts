import {RequestManager} from "./Emitter/RequestManager";
import {LocalPlayer} from "./LocalPlayer";
import Socket = SocketIOClient.Socket;

export class Utility {

    private static _localPlayer: LocalPlayer;

    public static addLocalPlayer(player: IPlayer, secretKey: string, socket: Socket) {
        this._localPlayer = new LocalPlayer(player, secretKey);
        RequestManager.createRequestEmitter(socket);
    }

    public static getLocalPlayer() {
        return this._localPlayer;
    }

    public static equalsIPlayer(p1: IPlayer, p2: IPlayer) {
        if (p1 === p2 ) return true;
        return p1.name === p2.name && p1.color === p2.color;
    }

}
