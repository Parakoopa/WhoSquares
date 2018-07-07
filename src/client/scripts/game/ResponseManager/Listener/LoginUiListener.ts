import Socket = SocketIOClient.Socket;
import {Login} from "../../components/Login";

export class LoginUiListener {

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     * @param login
     */
    public listen(socket: Socket, login: Login) {
        // Initial Connection
        socket.on("connected", (resp: IRegisteredResponse) => {
            localStorage["who-squares-private-key"] = resp.key;
        });

        // Error Feedback
        socket.on("nameUnavailable", () => {
            login.updateGameInfo("This name is unavailable. Choose again.");
        });
        socket.on("roomIsFull", () => {
            login.updateGameInfo("Room is full!");
        });
        socket.on("refresh", () => {
            login.updateGameInfo("PLEASE REFRESH PAGE");
        });
        socket.on("observer", () => {
            login.updateGameInfo("Observers to not play!");
        });
        socket.on("notYourTurn", () => {
            login.updateGameInfo("It is not your turn!");
        });
        socket.on("notInRoom", () => {
            login.updateGameInfo("You are not in a room!");
        });
        socket.on("alreadyInRoom", () => {
            login.updateGameInfo("You are already in a room!");
        });
        socket.on("notOwner", () => {
            login.updateGameInfo("You are not the room owner!");
        });
        socket.on("gameAlreadyEnded", () => {
            login.updateGameInfo("the game already ended");
        });
    }

}
