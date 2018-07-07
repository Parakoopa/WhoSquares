import * as React from "react";
import {Routes} from "./ui/Routes";
import {ResponseManager} from "./game/ResponseManager/ResponseManager";
import {LocalPlayer} from "./game/LocalPlayer";

export class Connection {

    public static _socket: SocketIOClient.Socket;
    private static _localPlayer: IPlayer;

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

    public static setLocalPlayerParams( name: string, color: number, isObserver: boolean ): void {
        this.setLocalPlayer( {name, color, isObserver} );
    }

    public static setLocalPlayer(player: IPlayer): void {
        this._localPlayer = player;
    }

    public static getLocalPlayer(): IPlayer {
        return this._localPlayer;
    }

    public static getSocket(): SocketIOClient.Socket {
        return this._socket;
    }

}
