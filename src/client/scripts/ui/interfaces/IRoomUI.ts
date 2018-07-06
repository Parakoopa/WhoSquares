import {OtherPlayer} from "../../game/OtherPlayer";

export interface IRoomUI {

   //startedGame(sizeX: number, sizeY: number, missionName: string): void;
   // placedTile(y: number, x: number, player: IPlayer): void;
    updatePlayerList(players: OtherPlayer[] ): void;
    updateTurnInfo( player: IPlayer): void;
    updateWinner( winner: IPlayer): void;
    updateMission( mission: IMission): void;
   // key: string;
    sendRoomMessage(player: IPlayer, message: string): void;

}
