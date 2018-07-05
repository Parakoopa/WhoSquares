import * as React from "react";
import {Routes} from "./ui/Routes";

export class Connection {

    public static _socket: SocketIOClient.Socket;
    private static _localPlayer: IPlayer;

    public static initSocket(callback: any) {
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

        this._socket.once("connected", (resp: IConnectedResponse) => {
            this.setKey(resp.key);

            if (callback)
                callback();
        });
    }

    public static login(username: string, callback: any): boolean {
        if (!username)
            return false;
        else {
            this.initSocket(() => {

                console.log("UserLogin!");

                this._socket.emit("userName", {playerKey: this.getKey(), playerName: username});

                this._socket.once("nameUnavailable", () => {
                    alert("Name unavailable!");
                    window.location.href = Routes.linkToLoginHREF();
                });
                this._socket.once("userName", (resp: IUserNameResponse) => {
                    this.setLocalPlayer(resp.player);
                    this.setUsername(resp.player.name);

                    if (callback)
                        callback();
                });
            });
        }

        return true;
    }

    public static joinLobby(callback: any): boolean {
        const username = this.getUsername();

        if (!username)
            return false;

        const ok = this._socket || this.login(username, null);

        if (!ok)
            return false;

        this._socket.emit("joinLobby");
        this._socket.once("joinLobby", callback);
        return true;
    }

    public static joinRoom(callback: any): boolean {
        const username = this.getUsername();
        if (!username) {
            window.location.href = Routes.linkToLoginHREF();
            return false;
        }

        if (!this._socket && !this.login(username, null)) {
            alert("Can't establish connection!");
            return false;
        }

        const roomname = this.getRoomname();
        if (!roomname) {
            alert("No Roomname available!");
            return false;
        }

        if (callback)
            callback();

        return true;
    }

    public static getSocket(callback: any): boolean {
        const ok = this.joinRoom(null);

        if (!ok)
            return false;

        console.log("GetSocket worked! : " + this._socket);
        callback(this._socket);
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

    public static setUsername(username: string):
        void {
        localStorage["who-squares-username"] = username;
    }

    public static setRoomname(roomid: string): void {
        localStorage["who-squares-roomname"] = roomid;
    }

    public static getRoomname(): string {
        return localStorage["who-squares-roomname"];
    }

    public static setLocalPlayer(player: IPlayer): void {
        this._localPlayer = player;
    }

    public static getLocalPlayer(): IPlayer {
        return this._localPlayer;
    }

}
