import Socket = SocketIOClient.Socket;
import {IUserInterface} from "../../../ui/IUserInterface";

// ToDo rename into messageListener or smth like that
export class ErrorListener {

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     * @param {UiManager} _ui
     */
    public static listen(socket: Socket, _ui: IUserInterface) {

        // Error Feedback
        socket.on("nameUnavailable", () => {
            _ui.updateGameInfo("This name is unavailable. Choose again.");
        });
        socket.on("roomIsFull", () => {
            _ui.updateGameInfo("Room is full!");
        });
        socket.on("refresh", () => {
            _ui.updateGameInfo("PLEASE REFRESH PAGE");
        });
        socket.on("observer", () => {
            _ui.updateGameInfo("Observers to not play!");
        });
        socket.on("notYourTurn", () => {
            _ui.updateGameInfo("It is not your turn!");
        });
        socket.on("notInRoom", () => {
            _ui.updateGameInfo("You are not in a room!");
        });
        socket.on("alreadyInRoom", () => {
            _ui.updateGameInfo("You are already in a room!");
        });
        socket.on("notOwner", () => {
            _ui.updateGameInfo("You are not the room owner!");
        });
        socket.on("gameAlreadyEnded", () => {
            _ui.updateGameInfo("the game already ended");
        });
        socket.on("roomMessage", (resp: IRoomMessageResponse) => {
            _ui.roomMessage(resp.player, resp.message);
        });
    }

}
