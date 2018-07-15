import Socket = SocketIOClient.Socket;
import {RequestEmitter} from "./emitter/RequestEmitter";

/**
 * Static class that manages and provides access to RequestEmitter
 */
export class RequestManager {

    private static _requestEmitter: RequestEmitter;

    public static createRequestEmitter( socket: Socket): RequestEmitter {
        if (!this._requestEmitter) {
            this._requestEmitter = new RequestEmitter(socket);
        }
        return this._requestEmitter;
    }

    public static get requestEmitter(): RequestEmitter {
        return this._requestEmitter;
    }
}
