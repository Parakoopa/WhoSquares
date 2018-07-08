export interface ILobbyUI {
    updateRoomList(rooms: IRoomListResponse): void;
    updateGameInfo(info: string): void;
}
