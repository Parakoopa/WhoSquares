import Socket = SocketIOClient.Socket;
import {Lobby} from "../../components/Lobby";

export class LobbyUiListener {

    constructor(socket: Socket, private _lobby: Lobby) {
        this.listen(socket);
    }

    public reListen(val: Lobby) {
        this._lobby = val;
    }

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     */
    public listen(socket: Socket) {
        // ToDo add listener to update roomlist
    }

}
