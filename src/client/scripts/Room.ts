import {GameManager} from "./GameManager";
import {LocalPlayer} from "./LocalPlayer";
import {OtherPlayer} from "./OtherPlayer";

export class Room {

    constructor(
        private _localPlayer: LocalPlayer,
        private _roomKey: string,
        private _roomName: string,
        private _gameMan: GameManager,
        private _otherPlayers: OtherPlayer[]
    ) {
       // this._gameMan.color(parseInt(resp.color, 16));
        this._gameMan.textElement("you joined as: " + _localPlayer.color + " in:" + _roomKey);
        this._gameMan.roomName(_roomName);
    }

    public get key(): string {
        return this._roomKey;
    }

    public leftRoom(resp: ILeftResponse): void {
        this._roomName = null;
        this._roomKey = null;
        // ToDo reset color: this._gameMan.color(parseInt(resp.color, 16));
        this._gameMan.textElement("left room");
        this._gameMan.roomName("left room");
        this._gameMan.destroyGrid();
        this.resetPlayers();
    }

    public otherLeftRoom(resp: IOtherLeftResponse): void {
        const player: OtherPlayer = this.playerByName(resp.name);
        this.removePlayer(player);
    }

    public otherJoinedRoom(resp: IOtherJoinedResponse): void {
        const player: OtherPlayer = new OtherPlayer(resp.otherPlayer);
        this.addPlayer(player);
    }

    public placedTile(resp: IPlacedTileResponse): void {
        const color: number = parseInt(resp.playerColor, 16);
        this._gameMan.placedTile(color, resp.x, resp.y);
        this._gameMan.textElement(resp.response);
    }

    public startedGame(resp: IStartGameResponse) {
        this._gameMan.createGrid(resp.sizeX, resp.sizeY, this._localPlayer.getColorHex());
        const textMessage: string = resp.response;
        this._gameMan.textElement(textMessage);
    }

    private playerByName(playerName: string): OtherPlayer {
        for (const player of this._otherPlayers) {
            if (player.name === playerName) return player;
        }
        return null;
    }
    private addPlayers(players: IPlayer[]): void {
        this._otherPlayers = []; // Reset on Join Room
        for (const player of players) {
            this._otherPlayers.push(new OtherPlayer(player));
        }
        this.updateRoomList();
    }

    private addPlayer(player: OtherPlayer): void {
        this._otherPlayers.push(player);
        this.updateRoomList();
    }

    private removePlayer(player: OtherPlayer): void {
        const index: number = this._otherPlayers.indexOf(player);
        if (index > -1) this._otherPlayers.splice(index, 1);
        this.updateRoomList();
    }

    private resetPlayers(): void {
        this._otherPlayers = [];
        this.updateRoomList();
    }

    private updateRoomList(): void {
        let roomList: string = "";
        for (const player of this._otherPlayers) {
            roomList += player.name + "\n";
        }
        this._gameMan.roomList(roomList);

    }

}
