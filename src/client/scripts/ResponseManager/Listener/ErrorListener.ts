import Socket = SocketIOClient.Socket;
import {UiManager} from "../../UiManager";

export class ErrorListener {

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     * @param {UiManager} _uiManager
     */
    public static listen(socket: Socket, _uiManager: UiManager) {

        // Error Feedback
        // Actions
        socket.on("roomIsFull", (resp: IRoomIsFullResponse) => {
            _uiManager.textElement(resp.response);
        });
        socket.on("refresh", (resp: IRefreshResponse) => {
            _uiManager.textElement("PLEASE REFRESH PAGE");
        });
        socket.on("observer", () => {
            _uiManager.textElement("Observers to not play!");
        });
        socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            _uiManager.textElement("It is not your turn!");
        });
        socket.on("notInRoom", () => {
            _uiManager.textElement("You are not in a room!");
        });
        socket.on("alreadyInRoom", () => {
            _uiManager.textElement("You are already in a room!");
        });
        socket.on("notOwner", () => {
            _uiManager.textElement("You are not the room owner!");
        });
    }

}
