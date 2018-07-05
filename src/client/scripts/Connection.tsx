import * as React from "react";
import {Routes} from "./ui/Routes";

export class Connection {

    private static _socket: SocketIOClient.Socket;
    private static _localPlayer: IPlayer;
    private static _key: string;

    public static getSocket(callback: any): void {
        if (this.joinRoom(this.getRoomname(), () => {})) {

            console.log("GetSocket worked! : " + this._socket );
            callback(this._socket);
        }
    }

    public static login(username: string, callback: any): boolean {
        if (username === undefined)
            return false;
        else {
            console.log("send key:" + username);
            this._socket = this.initSocket(username);
        }

        if (this._socket === undefined)
            return false;

        this._socket.once("connected", (resp: IConnectedResponse) => {
            console.log("connected and got key:" + resp.key);
            this.setUsername(resp.key); // only strings

            this._localPlayer = resp.player;
            this._key = resp.key;

            if (callback !== null)
                callback();
        });

        return true;
    }

    public static joinLobby(callback: any): boolean {
        const username = this.getUsername();

        console.log("JoinLobby username:" + username);

        if (username === null)
            return false;


        console.log("JoinLobby Test if socket is online:" + this._socket === null);
        const ok = this._socket !== undefined || this.login(username, null);

        if (!ok)
            return false;

        this._socket.emit("joinLobby");
        this._socket.once("joinLobby", callback);
        return true;
    }

    public static joinRoom(newRoomname: string, callback: any): boolean {
        const username = this.getUsername();
        let roomname = this.getRoomname();
        if (username === null || newRoomname === null || roomname === null)
            return false;

        if (newRoomname !== roomname) {
            this.setRoomname(newRoomname);
            roomname = newRoomname;
        }

        const ok = this._socket !== undefined || this.login(username, null);

        if (!ok)
            return false;

        callback();

        return true;
    }

    public static initSocket(username: string): SocketIOClient.Socket {
        return io({
            transportOptions: {
                polling: {
                    extraHeaders: {
                        username
                    }
                }
            }
        });
    }

    public static getUsername(): string {
        return localStorage["who-squares-username"];
    }

    public static setUsername(username: string): void {
        localStorage["who-squares-username"] = username;
    }

    public static setRoomname(roomid: string): void {
        localStorage["who-squares-roomname"] = roomid;
    }

    public static getRoomname(): string {
        return localStorage["who-squares-roomname"];
    }

    public static getLocalPlayer(): IPlayer {
        return this._localPlayer;
    }

}
