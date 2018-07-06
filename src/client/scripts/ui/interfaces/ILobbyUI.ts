
export interface ILobbyUI {
    updateRoomList(rooms: string[] ): void;
  //  joinedRoom(resp: IJoinedResponse, ui: IRoomUI, grid: Grid): void;
    leftRoom(): void;
    otherLeftRoom(player: IPlayer): void;
    otherJoinedRoom(player: IPlayer): void;
    updateGameInfo(info: string): void;
}
