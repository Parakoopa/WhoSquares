import {Missions} from "../../../../common/scripts/Missions/Missions";
import {IRoomUI} from "../../ui/interfaces/IRoomUI";
import {ResponseManager} from "../communication/receiver/ResponseManager";
import {RequestEmitter} from "../communication/requester/emitter/RequestEmitter";
import {RequestManager} from "../communication/requester/RequestManager";
import {LocalPlayer} from "../entity/LocalPlayer/LocalPlayer";
import {LocalPlayerManager} from "../entity/LocalPlayer/LocalPlayerManager";
import {Grid} from "./phaser/grid/Grid";
import {GridFactory} from "./phaser/grid/GridFactory";

export class Room {

    private readonly _requestEmitter: RequestEmitter;
    private _grid: Grid;

    /**
     * Room has a secret key, a name, and a list of otherPlayers
     * (LocalPlayer is not listed as room itself is local)
     * @param _key
     * @param _name
     * @param _localPlayer
     * @param _otherPlayers
     * @param _ui
     * @param gridInfo
     */
    constructor(private _key: string,
                private _name: string,
                private _localPlayer: LocalPlayer,
                private _otherPlayers: IPlayer[],
                private _ui: IRoomUI,
                gridInfo: IPlayer[][] = null
    ) {
        _localPlayer.room = this;
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
     * @returns {IPlayer[]}
     */
    public get otherPlayers(): IPlayer[] {
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
        this._ui.updateMission(mission);
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
        this._localPlayer.isRoomOwner = LocalPlayerManager.equalsIPlayer(this._localPlayer.player, roomOwner);
        this._localPlayer.isRoomOwner = roomOwner === this._localPlayer.player;
        this.removePlayer(player);
        if (this._grid) this._grid.removePlayer(player);
        this._ui.updatePlayerList(this._otherPlayers);
        // this._ui.updateGameInfo(player.name + "left");
    }

    /**
     * Create new Otherplayer and tell room to add it
     * @param player
     */
    public otherJoinedRoom(player: IPlayer): void {
        this.addPlayer(player);
        this._ui.updatePlayerList(this._otherPlayers);
        this._ui.updateGameInfo(player.name + "joined");
    }

    /**
     * DTell grid to destroy itself if it does exist
     */
    public destroyGrid(): void {
        if (!this._grid) return;
        this._grid.destroy();
    }

    /**
     *
     * @param {IPlayer} player
     */
    private addPlayer(player: IPlayer): void {
        if (this._otherPlayers.includes(player)) return;
        this._otherPlayers.push(player);
        this._ui.updatePlayerList(this._otherPlayers);
    }

    /**
     *
     * @param {IPlayer} player
     */
    private removePlayer(player: IPlayer): void {
        const index: number = this.getPlayerByIndex(player);
        if (index > -1) this._otherPlayers.splice(index, 1);
        this._ui.updatePlayerList(this._otherPlayers);
    }

    private getPlayerByIndex(otherPlayer: IPlayer): number {
        for (let i = 0; i < this.otherPlayers.length; i++) {
            if (LocalPlayerManager.equalsIPlayer(this._otherPlayers[i], otherPlayer)) return i;
        }
        return -1;
    }

    /**
     * Update Ui to display winner
     * @param {IPlayer} player
     * @param missionName
     * @param winTiles
     */
    public updateWinner(player: IPlayer, missionName: string, winTiles: ITile[]): void {
        this._grid.showWinTiles(winTiles);
        this._ui.updateWinner(player, missionName);
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

    public actionLeaveRoom( callback: () => void): void {
        this._requestEmitter.leaveRoom();
        callback();
    }

    /**
     * Tell room that localPlayer left & update Ui
     */
    public leftRoom(): void {
        this._localPlayer.room = null;
        this._localPlayer.isRoomOwner = false;
        this.destroyGrid();
        // destroy itself?
    }

    public hasGrid() {
        return !!this._grid;
    }

    public updateGameInfo(info: string): void {
        this._ui.updateGameInfo(info);
    }
}
