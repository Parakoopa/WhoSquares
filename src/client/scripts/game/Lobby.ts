import {ILobbyUI} from "../ui/interfaces/ILobbyUI";
import {IRoomUI} from "../ui/interfaces/IRoomUI";
import {LocalPlayer} from "./LocalPlayer";
import {Room} from "./Room";

export class Lobby {

    private _room: Room;

    constructor(private _ui: ILobbyUI, private _roomUi: IRoomUI, private _localPlayer: LocalPlayer) {}

    public get localPlayer(): LocalPlayer {
        return this._localPlayer;
    }

    public get room(): Room {
        return this._room;
    }

    /**
     * Tell room that localPlayer joined
     * If it contains a grid (running game) so create the grid
     * ToDo display client his role (player/observer)
     * @param {IJoinedResponse} resp
     */
    public joinedRoom(resp: IJoinedResponse) {
        this._room = new Room(resp.roomKey, resp.roomName, this.localPlayer, resp.otherPlayers, this._roomUi);
        this._localPlayer.color = resp.color;
        // If game already started, recreate grid
        this._ui.updateGameInfo("You joined, color: " + resp.color);
    }

    /**
     * Tell room that localPlayer left & update Ui
     */
    public leftRoom(): void {
        this._room.destroyGrid();
        this._room = null;
        this._ui.updateGameInfo("left room");
    }

    /**
     * Tell room that Otherplayer joined & update Ui
     * @param {IPlayer} otherPlayer
     */
    public otherJoinedRoom(otherPlayer: IPlayer): void {
        this._room.otherJoinedRoom(otherPlayer);
        this._ui.updateGameInfo(otherPlayer.name + "joined");
    }

    /**
     * Check if player really is in  a room
     * Tell room that otherPlayer left & update Ui
     * @param player
     */
    public otherLeftRoom(player: IPlayer): void {
        if (!this._room) return; // player currently disconnected
        this._room.otherLeftRoom(player);
        this._ui.updateGameInfo(player.name + "left");
    }

    public updateGameInfo(info: string) {
        this._ui.updateGameInfo(info);
    }

    public updateRoomList(rooms: string[]): void {
        /* Deprecated?
        let roomList = "Rooms: \n";
        for (const room of rooms) {
            roomList += room + "\n";
        }
        */
        this._ui.updateRoomList(rooms);
    }
}
