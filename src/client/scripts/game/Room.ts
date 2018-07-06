import {IRoomUI} from "../ui/interfaces/IRoomUI";
import {Grid} from "./Grid";
import {LocalPlayer} from "./LocalPlayer";
import {MissionDistributer} from "./MissionDistributer";
import {OtherPlayer} from "./OtherPlayer";
import {PhaserGame} from "./PhaserGame";

export class Room {

    private _otherPlayers: OtherPlayer[];

    /**
     * Room has a secret key, a name, and a list of otherPlayers
     * (LocalPlayer is not listed as room itself is local)
     * @param _key
     * @param _name
     * @param _localPlayer
     * @param {IPlayer[]} otherPlayers
     * @param _ui
     * @param _grid
     */
    constructor(private _key: string,
                private _name: string,
                private _localPlayer: LocalPlayer,
                otherPlayers: IPlayer[],
                private _ui: IRoomUI,
                private _grid: Grid = null
    ) {
        this._otherPlayers = this.toOtherPlayers(otherPlayers);
        this._ui.updatePlayerList(this._otherPlayers);
        _localPlayer.room = this;
    }

    public get key(): string {
        return this._key;
    }

    public set grid(val: Grid) {
        this._grid = val;
    }

    /**
     *
     * @returns {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     *
     * @returns {OtherPlayer[]}
     */
    public get otherPlayers(): OtherPlayer[] {
        return this._otherPlayers;
    }

    /**
     * Tell room to create game with given sizes & update Ui
     * @param {number} sizeX
     * @param {number} sizeY
     * @param missionName
     */
    public startedGame(sizeX: number, sizeY: number, missionName: string): void {
        this._grid = Grid.createGrid(sizeX, sizeY, this._localPlayer.color);
        this._localPlayer.mission = MissionDistributer.getMission(missionName);
        this.updateMission( this._localPlayer.mission);
    }

    public updateMission(mission: IMission): void {
        this._localPlayer.mission = mission;
    }

    /**
     * Tell room to place Tile & updateUi
     * @param {number} x
     * @param {number} y
     * @param {IPlayer} player
     */
    public placedTile(y: number, x: number, player: IPlayer): void {
        this._grid.placedTile(player, y, x);
    }

    /**
     * Get Player by name and tell room to remove it
     * @param player
     */
    public otherLeftRoom(player: IPlayer): void {
        const otherPlayer = this.getOtherPlayer(player);
        this.removePlayer(otherPlayer);
        this._grid.removePlayer(player);
        this._ui.updatePlayerList(this._otherPlayers);
    }

    /**
     * Create new Otherplayer and tell room to add it
     * @param {IPlayer} otherPlayer
     */
    public otherJoinedRoom(otherPlayer: IPlayer): void {
        const player: OtherPlayer = new OtherPlayer(otherPlayer);
        this.addPlayer(player);
        this._ui.updatePlayerList(this._otherPlayers);
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
        this._ui.updatePlayerList(this._otherPlayers);
    }

    /**
     * Remove OtherPlayer from this room if it exists
     * @param {OtherPlayer} player
     */
    private removePlayer(player: OtherPlayer): void {
        const index: number = this._otherPlayers.indexOf(player);
        if (index > -1) this._otherPlayers.splice(index, 1);
        this._ui.updatePlayerList(this._otherPlayers);
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
            this._ui.updatePlayerList(this._otherPlayers);
        }
    }

    /**
     * Update Ui to display winner
     * @param {IPlayer} player
     */
    public updateWinner(player: IPlayer): void {
        this._ui.updateWinner(player);
    }

    /**
     * Update Ui for current players turn
     * @param {IPlayer} player
     */
    public updateTurnInfo(player: IPlayer): void {
        this._ui.updateTurnInfo( player );
    }

    public roomMessage(player: IPlayer, message: string): void {
        this._ui.roomMessage(player, message);
    }

}
