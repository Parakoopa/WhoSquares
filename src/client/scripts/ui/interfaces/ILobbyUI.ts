
export interface ILobbyUI {
    updateRoomList(rooms: string[] ): void;
    leftRoom(): void;
    otherLeftRoom(player: IPlayer): void;
    otherJoinedRoom(player: IPlayer): void;
    updateGameInfo(info: string): void;
}
