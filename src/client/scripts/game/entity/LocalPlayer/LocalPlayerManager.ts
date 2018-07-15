import {RequestManager} from "../../communication/requester/RequestManager";
import {LocalPlayer} from "./LocalPlayer";
import Socket = SocketIOClient.Socket;

/**
 * Used to manage localPlayer
 * Necessary due to page refresh as only one localplayer
 * is permitted at any time
 */
export class LocalPlayerManager {

    private static _localPlayer: LocalPlayer;

    /**
     * Create a new LocalPlayer
     * @param {IPlayer} player
     * @param {string} secretKey
     * @param {SocketIOClient.Socket} socket
     */
    public static addLocalPlayer(player: IPlayer, secretKey: string, socket: Socket) {
        this._localPlayer = new LocalPlayer(player, secretKey);
        RequestManager.createRequestEmitter(socket);
    }

    /**
     *
     * @returns {LocalPlayer}
     */
    public static getLocalPlayer() {
        return this._localPlayer;
    }

    /**
     * @param {IPlayer} player
     * @returns {boolean}
     */
    public static equalsLocalPlayer(player: IPlayer) {
        return this.equalsIPlayer(this._localPlayer.player, player);
    }

    /**
     *
     * @param {IPlayer} p1
     * @param {IPlayer} p2
     * @returns {boolean}
     */
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
