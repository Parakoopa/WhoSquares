import * as React from "react";
import {ResponseManager} from "./game/communication/receiver/ResponseManager";

export class Connection {

    public static _socket: SocketIOClient.Socket;

    public static initSocket() {
        if (this._socket)
            return;

        const key = this.getKey();

        if (!key) {
            this._socket = io();
        } else {
            this._socket = io({
                transportOptions: {
                    polling: {
                        extraHeaders: {key}
                    }
                }
            });
        }

        ResponseManager.setSocket(this._socket);
    }

    public static getKey(): string {
        return localStorage["who-squares-secret-key"];
    }

    public static setKey(key: string): void {
        localStorage["who-squares-secret-key"] = key;
    }

    public static getUsername(): string {
        return localStorage["who-squares-username"];
    }

    public static setUsername(username: string): void {
        localStorage["who-squares-username"] = username;
    }

    public static getSocket(): SocketIOClient.Socket {
        return this._socket;
    }

}
