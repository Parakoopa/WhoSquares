/**
 * Defines the fFnctions for the Room.
 */
export interface IRoomUI {

    otherLeftRoom(player: IPlayer): void;
    otherJoinedRoom(player: IPlayer): void;
    // In Room Actions
   // startedGame(sizeX: number, sizeY: number, missionName: string): void;
   // placedTile(y: number, x: number, player: IPlayer): void;
    updatePlayerList(players: IPlayer[] ): void;
    updateTurnInfo( player: IPlayer): void;
    updateWinner( winner: IPlayer, missionName: string): void;
    updateMission( mission: IMission): void;
    sendRoomMessage(player: IPlayer, message: string): void;
    updateGameInfo(info: string): void;
}
