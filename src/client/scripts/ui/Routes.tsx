import * as React from "react";

export class Routes  {

    // Definitions
    public static APP_DEF: string = "/";
    public static LOGIN_DEF: string = "/login";
    public static LOBBY_DEF: string = "/lobby/:username";
    public static GAME_DEF: string = "/game/:username/:roomid";

    // Usable Routes
    private static APP: string = "/";
    private static LOGIN: string = "/login";
    private static LOBBY: string = "/lobby";
    private static GAME: string = "/game";

    public static linkToApp() {
        return Routes.APP;
    }

    public static linkToAppHREF() {
        return "/#" + Routes.APP;
    }

    public static linkToLogin() {
        return Routes.LOGIN;
    }

    public static linkToLoginHREF() {
        return "/#" + Routes.LOGIN;
    }

    public static linkToLobby( username: string ) {
        return Routes.LOBBY + "/" + username;
    }

    public static linkToLobbyHREF( username: string ) {
        return "/#" + this.linkToLobby(username);
    }

    public static linkToGame( username: string, roomid: string ) {
        return Routes.GAME + "/" + username + "/" + roomid;
    }

    public static linkToGameHREF( username: string, roomid: string ) {
        return "/#" + this.linkToGame(username, roomid);
    }
}
