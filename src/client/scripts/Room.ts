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
        this._otherPlayers = this.toOtherPlayers(otherPlayers);
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
     * @param player
     */
    public otherLeftRoom(player: IPlayer): void {
        const otherPlayer = this.getOtherPlayer(player);
        this.removePlayer(otherPlayer);
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
    public placedTile(y: number, x: number, player: IPlayer): void {
        this._grid.placedTile(player, y, x);
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
     * Add OtherPlayer to this room if not contained yet
     * ToDo might have to be adjusted dis/reconnect Responses are added
     * @param {OtherPlayer} player
     */
    private addPlayer(player: OtherPlayer): void {
        if (this._otherPlayers.includes(player)) return;
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

    private getOtherPlayer(player: IPlayer): OtherPlayer {
        for (const otherPlayer of this._otherPlayers) {
            // ToDo implement equals in real IPlayer on Client somehow
            if (otherPlayer.equals(player)) return otherPlayer;
        }
    }

    /**
     * Convert IPlayers to OtherPlayers
     * @param {IPlayer[]} players
     * @returns {OtherPlayer[]}
     */
    private toOtherPlayers(players: IPlayer[]): OtherPlayer[] {
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
