import {OtherPlayer} from "../game/OtherPlayer";

export interface IUserInterface {

    leaveRoom(): void;
    leftRoom(): void;
    startGame(): void;
    updatePlayerlist( players: OtherPlayer[] ): void;
    updateTurnInfo( player: IPlayer): void;
    updateGameInfo( gameInfo: string ): void;
    updateWinner( winner: IPlayer): void;
    getUsername(): string;
    getRoomID(): string;
}
