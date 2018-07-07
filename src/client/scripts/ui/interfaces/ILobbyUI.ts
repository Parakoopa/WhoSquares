import {LocalPlayer} from "../../game/LocalPlayer";

export interface ILobbyUI {
    updateRoomList(rooms: string[] ): void;
    joinedRoom(roomKey: string, roomName: string, localPlayer: LocalPlayer, otherPlayers: IPlayer[], gridInfo: IPlayer[][]): void;
    leftRoom(): void;
    otherLeftRoom(player: IPlayer): void;
    otherJoinedRoom(player: IPlayer): void;
    updateGameInfo(info: string): void;
}
