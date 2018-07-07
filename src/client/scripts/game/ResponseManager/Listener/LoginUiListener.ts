import Socket = SocketIOClient.Socket;
import {Login} from "../../components/Login";

export class LoginUiListener {

    constructor(socket: Socket, private _login: Login) {
        this.listen(socket);
    }

    public reListen(val: Login) {
        this._login = val;
    }

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     */
    private listen(socket: Socket) {
        // Initial Connection
        socket.on("connected", (resp: IRegisteredResponse) => {
            localStorage["who-squares-private-key"] = resp.key;
        });

        // Error Feedback
        socket.on("nameUnavailable", () => {
            this._login.updateGameInfo("This name is unavailable. Choose again.");
        });
        socket.on("roomIsFull", () => {
            this._login.updateGameInfo("Room is full!");
        });
        socket.on("refresh", () => {
            this._login.updateGameInfo("PLEASE REFRESH PAGE");
        });
        socket.on("observer", () => {
            this._login.updateGameInfo("Observers to not play!");
        });
        socket.on("notYourTurn", () => {
            this._login.updateGameInfo("It is not your turn!");
        });
        socket.on("notInRoom", () => {
            this._login.updateGameInfo("You are not in a room!");
        });
        socket.on("alreadyInRoom", () => {
            this._login.updateGameInfo("You are already in a room!");
        });
        socket.on("notOwner", () => {
            this._login.updateGameInfo("You are not the room owner!");
        });
        socket.on("gameAlreadyEnded", () => {
            this._login.updateGameInfo("the game already ended");
        });
    }

}
