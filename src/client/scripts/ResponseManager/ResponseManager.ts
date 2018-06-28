import Socket = SocketIOClient.Socket;
import {GameManager} from "../GameManager";
import {UiManager} from "../UiManager";
import {ErrorListener} from "./Listener/ErrorListener";
import {EventListener} from "./Listener/EventListener";

export class ResponseManager {

    /**
     * Start EventListener for Events & Errors
     * @param {GameManager} _gameMan
     * @param {SocketIOClient.Socket} _socket
     * @param {UiManager} _uiManager
     */
    constructor(private _gameMan: GameManager, private _socket: Socket, private _uiManager: UiManager) {
        EventListener.listen(_socket, _gameMan);
        ErrorListener.listen(_socket, _uiManager);
    }

}
