import Socket = SocketIOClient.Socket;
import {Lobby} from "../../Lobby";

// ToDo rename into messageListener or smth like that
export class LobbyUiListener {

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     * @param lobby
     */
    public listen(socket: Socket, lobby: Lobby) {
        socket.on("joinedRoom", (resp: IJoinedResponse) => {
            lobby.joinedRoom(resp);
        });
        socket.on("leftRoom", (resp: ILeftResponse) => {
            lobby.leftRoom();
        });
        socket.on("otherLeftRoom", (resp: IOtherLeftResponse) => {
            lobby.otherLeftRoom(resp.player);
        });
        socket.on("otherJoinedRoom", (resp: IOtherJoinedResponse) => {
            lobby.otherJoinedRoom(resp.otherPlayer);
        });
    }

}
