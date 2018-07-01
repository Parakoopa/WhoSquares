import Socket = SocketIOClient.Socket;
import {IUserInterface} from "../../ui/IUserInterface";
import {GameManager} from "../GameManager";
import {ErrorListener} from "./Listener/ErrorListener";
import {EventListener} from "./Listener/EventListener";

export class ResponseManager {

    /**
     * Start EventListener for Events & Errors
     * @param {GameManager} _gameMan
     * @param {SocketIOClient.Socket} _socket
     * @param {IUserInterface} _ui
     */
    constructor(private _gameMan: GameManager, private _socket: Socket, private _ui: IUserInterface) {
        EventListener.listen(_socket, _gameMan);
        ErrorListener.listen(_socket, _ui);
    }

}
