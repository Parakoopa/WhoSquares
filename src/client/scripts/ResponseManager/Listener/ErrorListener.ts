import Socket = SocketIOClient.Socket;
import {UiManager} from "../../UiManager";

export class ErrorListener {

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} _socket
     * @param {UiManager} _uiManager
     */
    public static listen(_socket: Socket, _uiManager: UiManager) {

        // Error Feedback
        // Actions
        _socket.on("roomIsFull", (resp: IRoomIsFullResponse) => {
            _uiManager.textElement(resp.response);
        });
        _socket.on("refresh", (resp: IRefreshResponse) => {
            _uiManager.textElement("PLEASE REFRESH PAGE");
        });
        _socket.on("observer", () => {
            _uiManager.textElement("Observers to not play!");
        });
        _socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            _uiManager.textElement("It is not your turn!");
        });
        _socket.on("notInRoom", () => {
            _uiManager.textElement("You are not in a room!");
        });
        _socket.on("alreadyInRoom", () => {
            _uiManager.textElement("You are already in a room!");
        });
        _socket.on("notOwner", () => {
            _uiManager.textElement("You are not the room owner!");
        });
    }

}
