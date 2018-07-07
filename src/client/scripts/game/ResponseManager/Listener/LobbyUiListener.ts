import Socket = SocketIOClient.Socket;
import {Lobby} from "../../components/Lobby";

// ToDo rename into messageListener or smth like that
export class LobbyUiListener {

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     * @param lobby
     */
    public listen(socket: Socket, lobby: Lobby) {
        // ToDo add listener to update roomlist
    }

}
