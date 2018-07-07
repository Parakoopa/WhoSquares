import Socket = SocketIOClient.Socket;
import {Lobby} from "../components/Lobby";
import {Login} from "../components/Login";
import {Room} from "../components/Room";
import {LobbyUiListener} from "./Listener/LobbyUiListener";
import {LoginUiListener} from "./Listener/LoginUiListener";
import {RoomUiListener} from "./Listener/RoomUiListener";

export class ResponseManager {

    private static _loginUiListener: LoginUiListener;
    private static _lobbyUiListener: LobbyUiListener;
    private static _roomUiListener: RoomUiListener;
    private static _socket: SocketIOClient.Socket;

    /**
     * Start EventListener for Events & Errors
     * @param val
     */
    public static setSocket(val: Socket) {
        this._socket = val;
    }

    public static  createLoginListener(login: Login) {
        if (!this._loginUiListener) this._loginUiListener = new LoginUiListener(this._socket, login);
        else this._loginUiListener.reListen(login);
    }

    public static createLobbyListener(lobby: Lobby) {
        if (!this._lobbyUiListener) this._lobbyUiListener = new LobbyUiListener(this._socket, lobby);
        else this._lobbyUiListener.reListen(lobby);
    }

    public static createRoomUIListener(room: Room) {
        if (!this._roomUiListener) this._roomUiListener = new RoomUiListener(this._socket, room);
        else this._roomUiListener.reListen(room);
    }

}
