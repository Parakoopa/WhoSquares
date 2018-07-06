export interface ILoginUI {
    startGame(): void;
    leaveRoom(): void;
    addLocalPlayer(player: IPlayer, secretKey: string, socket: SocketIOClient.Socket): void;
    updateGameInfo( gameInfo: string ): void;
}
