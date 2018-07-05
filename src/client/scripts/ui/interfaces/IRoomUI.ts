import {OtherPlayer} from "../../game/OtherPlayer";

export interface IRoomUI {

    leaveRoom(): void;
    leftRoom(): void;
    startGame(): void;
    updatePlayerlist( players: OtherPlayer[] ): void;
    updateTurnInfo( player: IPlayer): void;
    updateGameInfo( gameInfo: string ): void;
    updateWinner( winner: IPlayer): void;
    getUsername(): string;
    getRoomID(): string;
    roomMessage(player: IPlayer, message: string): void;
}
