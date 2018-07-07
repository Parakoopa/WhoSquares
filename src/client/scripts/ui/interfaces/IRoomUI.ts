import {OtherPlayer} from "../../game/OtherPlayer";

export interface IRoomUI {
    // Room Management
    joinedRoom(color: number, roomKey: string, roomName: string, otherPlayers: IPlayer[], gridInfo: IPlayer[][]): void;
    leftRoom(): void;
    otherLeftRoom(player: IPlayer): void;
    otherJoinedRoom(player: IPlayer): void;
    // In Room Actions
   // startedGame(sizeX: number, sizeY: number, missionName: string): void;
   // placedTile(y: number, x: number, player: IPlayer): void;
    updatePlayerList(players: OtherPlayer[] ): void;
    updateTurnInfo( player: IPlayer): void;
    updateWinner( winner: IPlayer): void;
    updateMission( mission: IMission): void;
    sendRoomMessage(player: IPlayer, message: string): void;

}
