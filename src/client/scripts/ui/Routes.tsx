import * as React from "react";

/**
 * Central Definition for all Route-Actions!
 */
export class Routes  {

    // Util
    private static HREF_PREFIX: string = "/#";

    // Definitions
    public static APP_DEF: string = "/";
    public static LOGIN_DEF: string = "/login/:jumpToRoom?";
    public static LOBBY_DEF: string = "/lobby";
    public static GAME_DEF: string = "/game/:roomid";
    public static GAME_STATS_DEF: string = "/game-stats/:roomid";

    // Usable Routes
    private static APP: string = "/";
    private static LOGIN: string = "/login";
    private static LOBBY: string = "/lobby";
    private static GAME: string = "/game";
    private static GAME_STATS: string = "/game-stats";

    public static linkToApp() {
        return Routes.APP;
    }

    public static linkToAppHREF() {
        return this.HREF_PREFIX + Routes.APP;
    }

    public static linkToLogin() {
        return Routes.LOGIN;
    }

    public static linkToLoginHREF() {
        return this.HREF_PREFIX + Routes.LOGIN;
    }

    public static linkToLobby() {
        return Routes.LOBBY;
    }

    public static linkToLobbyHREF() {
        return this.HREF_PREFIX + this.linkToLobby();
    }

    public static linkToGame( roomid: string ) {
        return Routes.GAME + "/" + roomid;
    }

    public static linkToGameHREF( roomid: string ) {
        return this.HREF_PREFIX + this.linkToGame(roomid);
    }

    public static linkToGameStats( roomid: string ) {
        return Routes.GAME_STATS + "/" + roomid;
    }

    public static linkToGameStatsHREF( roomid: string ) {
        return this.HREF_PREFIX + this.linkToGameStats(roomid);
    }
}
