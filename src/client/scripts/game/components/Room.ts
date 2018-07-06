import {IRoomUI} from "../../ui/interfaces/IRoomUI";
import {RequestEmitter} from "../Emitter/RequestEmitter";
import {RequestManager} from "../Emitter/RequestManager";
import {LocalPlayer} from "../LocalPlayer";
import {OtherPlayer} from "../OtherPlayer";
import {ResponseManager} from "../ResponseManager/ResponseManager";
import {Grid} from "./grid/Grid";
import {GridFactory} from "./grid/GridFactory";
import {Utility} from "../Utility";
import {Missions} from "../../../../common/scripts/Missions/Missions";

export class Room {

    private _otherPlayers: OtherPlayer[];
    private readonly _requestEmitter: RequestEmitter;
    private _grid: Grid;

    /**
     * Room has a secret key, a name, and a list of otherPlayers
     * (LocalPlayer is not listed as room itself is local)
     * @param _key
     * @param _name
     * @param _localPlayer
     * @param {IPlayer[]} otherPlayers
     * @param _ui
     * @param gridInfo
     */
    constructor(private _key: string,
                private _name: string,
                private _localPlayer: LocalPlayer,
                otherPlayers: IPlayer[],
                private _ui: IRoomUI,
                gridInfo: IPlayer[][] = null
    ) {
        console.log("created room: " + _name);
        _localPlayer.room = this;
        this._otherPlayers = this.toOtherPlayers(otherPlayers);
        this._ui.updatePlayerList(this._otherPlayers);
        this._requestEmitter = RequestManager.requestEmitter;
        ResponseManager.createRoomUIListener(this);
        if (gridInfo) this._grid = GridFactory.createGridByInfo(gridInfo, _localPlayer.color, this._requestEmitter);
    }

    public get key(): string {
        return this._key;
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

    public static actionJoinRoom(roomName: string): void {
        RequestManager.requestEmitter.joinRoom(roomName);
    }

    public actionStartGame(x: number, y: number): void {
        this._requestEmitter.startGame(x, y);
    }

    public actionSendRoomMessage(message: string) {
        this._requestEmitter.roomMessage(message);
    }

    /**
     * Tell room to create game with given sizes & update Ui
     * @param {number} sizeX
     * @param {number} sizeY
     * @param missionName
     */
    // ToDo maybe inform roomview instead of using turninfo
    public startedGame(sizeX: number, sizeY: number, missionName: string): void {
        if (this._grid) this.destroyGrid();
        this._grid = GridFactory.createGrid(sizeX, sizeY, this._localPlayer.color, this._requestEmitter);
        this._localPlayer.mission = Missions.getMission(missionName);
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
     * @param roomOwner
     */
    public otherLeftRoom(player: IPlayer, roomOwner: IPlayer): void {
        // set whether localPlayer is new room owner
        this._localPlayer.isRoomOwner = Utility.equalsIPlayer(this._localPlayer.player, roomOwner);
        this._localPlayer.isRoomOwner = roomOwner === this._localPlayer.player;
        const otherPlayer = this.getOtherPlayer(player);
        this.removePlayer(otherPlayer);
        this._grid.removePlayer(player);
        this._ui.updatePlayerList(this._otherPlayers);
        // this._ui.updateGameInfo(player.name + "left");
    }

    /**
     * Create new Otherplayer and tell room to add it
     * @param {IPlayer} otherPlayer
     */
    public otherJoinedRoom(otherPlayer: IPlayer): void {
        const player: OtherPlayer = new OtherPlayer(otherPlayer);
        this.addPlayer(player);
        this._ui.updatePlayerList(this._otherPlayers);
        // this._ui.updateGameInfo(otherPlayer.name + "joined");
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
            if (Utility.equalsIPlayer(otherPlayer.player, player)) return otherPlayer;
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
        this._ui.sendRoomMessage(player, message);
    }

    public actionLeaveRoom(): void {
        this._requestEmitter.leaveRoom();
        this._ui.leftRoom();
    }

    /**
     * Tell room that localPlayer left & update Ui
     */
    public leftRoom(): void {
        this._localPlayer.room = null;
        this._localPlayer.isRoomOwner = false;
        this.destroyGrid();
        // this._ui.updateGameInfo("left room");
        // destroy itself?
    }

    public hasGrid() {
        return !!this._grid;
    }
}
