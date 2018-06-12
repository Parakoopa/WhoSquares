import {Grid} from "./Grid";
import {OtherPlayer} from "./OtherPlayer";

export class Room {

    private _otherPlayers: OtherPlayer[];
    private _grid: Grid;

    /**
     * Room has a secret key, a name, and a list of otherPlayers
     * (LocalPlayer is not listed as room itself is local)
     * @param {string} _roomKey
     * @param {string} _roomName
     * @param {IPlayer[]} otherPlayers
     */
    constructor(private _roomKey: string, private _roomName: string, otherPlayers: IPlayer[]) {
        this._otherPlayers = this.toOtherPlayer(otherPlayers);
    }

    /**
     *
     * @returns {string}
     */
    public get key(): string {
        return this._roomKey;
    }

    /**
     *
     * @returns {string}
     */
    public get name(): string {
        return this._roomName;
    }

    /**
     *
     * @returns {OtherPlayer[]}
     */
    public get otherPlayers(): OtherPlayer[] {
        return this._otherPlayers;
    }

    /**
     * Get Player by name and tell room to remove it
     * @param {string} name
     */
    public otherLeftRoom(name: string): void {
        const player: OtherPlayer = this.playerByName(name);
        this.removePlayer(player);
    }

    /**
     * Create new Otherplayer and tell room to add it
     * @param {IPlayer} otherPlayer
     */
    public otherJoinedRoom(otherPlayer: IPlayer): void {
        const player: OtherPlayer = new OtherPlayer(otherPlayer);
        this.addPlayer(player);
    }

    /**
     * Tell grid to assign tile on x,y to given IPlayer
     * (IPlayer can ne LocalPlayer or OtherPlayer
     * @param {number} x
     * @param {number} y
     * @param {IPlayer} player
     */
    public placedTile(x: number, y: number, player: IPlayer): void {
        this._grid.placedTile(player, x, y);
    }

    /**
     * A new game has been started so destroy old grid
     * and assign new one
     * @param {Grid} grid
     */
    public startedGame(grid: Grid) {
        this.destroyGrid(); // Destroy previous grid;
        this._grid = grid;
    }

    /**
     * DTell grid to destroy itself if it does exist
     */
    public destroyGrid(): void {
        if (!this._grid) return;
        this._grid.destroy();
    }

    /**
     * Try to get OtherPlayer of this room by its name
     * @param {string} playerName
     * @returns {OtherPlayer}
     */
    private playerByName(playerName: string): OtherPlayer {
        for (const player of this._otherPlayers) {
            if (player.name === playerName) return player;
        }
        return null;
    }

    /**
     * Add OtherPlayer to this room
     * @param {OtherPlayer} player
     */
    private addPlayer(player: OtherPlayer): void {
        this._otherPlayers.push(player);
    }

    /**
     * Remove OtherPlayer from this room if it exists
     * @param {OtherPlayer} player
     */
    private removePlayer(player: OtherPlayer): void {
        const index: number = this._otherPlayers.indexOf(player);
        if (index > -1) this._otherPlayers.splice(index, 1);
    }

    /**
     * Convert IPlayers to OtherPlayers
     * @param {IPlayer[]} players
     * @returns {OtherPlayer[]}
     */
    private toOtherPlayer(players: IPlayer[]): OtherPlayer[] {
        const otherPlayers = []; // Reset on Join Room
        for (const player of players) {
            otherPlayers.push(new OtherPlayer(player));
        }
        return otherPlayers;
    }

    /**
     * Deprecated?
     * @param {IPlayer[]} players
     */
    private addPlayers(players: IPlayer[]): void {
        this._otherPlayers = []; // Reset on Join Room
        for (const player of players) {
            this._otherPlayers.push(new OtherPlayer(player));
        }
    }
}
