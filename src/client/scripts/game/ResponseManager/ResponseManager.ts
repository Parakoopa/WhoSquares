import Socket = SocketIOClient.Socket;
import {Lobby} from "../Lobby";
import {Login} from "../Login";
import {Room} from "../Room";
import {LobbyUiListener} from "./Listener/LobbyUiListener";
import {LoginUiListener} from "./Listener/LoginUiListener";
import {RoomUiListener} from "./Listener/RoomUiListener";

export class ResponseManager {

    private _loginUiListener: LoginUiListener;
    private _lobbyUiListener: LobbyUiListener;
    private _roomUiListener: RoomUiListener;

    /**
     * Start EventListener for Events & Errors
     * @param {SocketIOClient.Socket} _socket
     */
    constructor(private _socket: Socket) {
    }

    public createLoginListener(login: Login) {
        if (!this._loginUiListener) this._loginUiListener = new LoginUiListener();
        this._loginUiListener.listen(this._socket, login);
    }

    public createLobbyListener(lobby: Lobby) {
        if (!this._lobbyUiListener) this._lobbyUiListener = new LobbyUiListener();
        this._lobbyUiListener.listen(this._socket, lobby);
    }

    public createRoomUIListener(room: Room) {
        if (!this._roomUiListener) this._roomUiListener = new RoomUiListener();
        this._roomUiListener.listen(this._socket, room);
    }

}
