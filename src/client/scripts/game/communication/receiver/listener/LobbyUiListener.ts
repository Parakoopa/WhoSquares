import Socket = SocketIOClient.Socket;
import {Lobby} from "../../../components/Lobby";

/**
 * Manages distribution of incoming events for the lobby
 */
export class LobbyUiListener {

    constructor(socket: Socket, private _lobby: Lobby) {
        this.listen(socket);
    }

    /**
     * Update lobby component in case of f.e. page refresh
     * @param {Lobby} val
     */
    public reListen(val: Lobby) {
        this._lobby = val;
    }

    /**
     * Listen for events on socket
     * @param {SocketIOClient.Socket} socket
     */
    public listen(socket: Socket) {
        // There are currently no lobby specific events.
    }

}
