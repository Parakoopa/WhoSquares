import {LocalPlayer} from "../../game/LocalPlayer";

export interface ILobbyUI {
    updateRoomList(rooms: string[] ): void;
    updateGameInfo(info: string): void;
}
