import {Grid} from "./Grid";
import {OtherPlayer} from "./OtherPlayer";

export class Room {

    private _otherPlayers: OtherPlayer[];
    private _grid: Grid;

    constructor(
        private _roomKey: string,
        private _roomName: string,
        otherPlayers: IPlayer[]
    ) {
        this._otherPlayers = this.toOtherPlayer(otherPlayers);
    }

    public get key(): string {
        return this._roomKey;
    }

    public get name(): string {
        return this._roomName;
    }

    public get otherPlayers(): OtherPlayer[] {
        return this._otherPlayers;
    }

    public otherLeftRoom(name: string): void {
        const player: OtherPlayer = this.playerByName(name);
        this.removePlayer(player);
    }

    public otherJoinedRoom(otherPlayer: IPlayer): void {
        const player: OtherPlayer = new OtherPlayer(otherPlayer);
        this.addPlayer(player);
    }

    public placedTile(x: number, y: number, player: IPlayer): void {
        this._grid.placedTile(player, x, y);
    }

    public startedGame(grid: Grid) {
        this.destroyGrid(); // Destroy previous grid;
        this._grid = grid;
    }

    public destroyGrid(): void {
        if (!this._grid) return;
        this._grid.destroy();
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
    }

    private addPlayer(player: OtherPlayer): void {
        this._otherPlayers.push(player);
    }

    private removePlayer(player: OtherPlayer): void {
        const index: number = this._otherPlayers.indexOf(player);
        if (index > -1) this._otherPlayers.splice(index, 1);
    }

    private toOtherPlayer(players: IPlayer[]): OtherPlayer[] {
        const otherPlayers = []; // Reset on Join Room
        for (const player of players) {
            otherPlayers.push(new OtherPlayer(player));
        }
        return otherPlayers;
    }

}
