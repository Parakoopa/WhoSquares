import {Player} from "./Player";
import {ColorDistributer} from "./ColorDistributer";
import {IEvent} from "./Event";
import {MissionDistributer} from "./MissionDistributer";
import {ServerGrid} from "./ServerGrid";
import {TurnManager} from "./TurnManager";

/**
 * A Room hosts a game for players
 * Each player gets a color assigned
 */
export class Room implements IRoom {

    private _owner: Player;
    private readonly _players: Player[];
    private _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;
    private _missionDistr: MissionDistributer;
    private _turnManager: TurnManager;

    constructor(private _name: string, private _key: string, private _size: number) {
        this._players = [];
        this._colorDistr = new ColorDistributer();
        this._missionDistr = new MissionDistributer();
        this._turnManager = new TurnManager();
    }

    public get name(): string {
        return this._name;
    }

    public get key(): string {
        return this._key;
    }

    public get players(): Player[] {
        return this._players;
    }

    public get size(): number {
        return this._size;
    }

    public Owner(): Player {
        return this._owner;
    }

    get grid(): ServerGrid {
        return this._serverGrid;
    }

    set grid(value: ServerGrid) {
        this._serverGrid = value;
    }

    /**
     * Add Player & assign/return its color
     * @param {Player} player
     * @returns {string}
     * @constructor
     */
    public AddPlayer(player: Player): string { // ToDo make string into color enum
        if (!this._owner) this._owner = player;
        player.room = this;
        this._players.push(player);
        this._turnManager.addPlayer(player);
        this._missionDistr.setMission(player);
        return this._colorDistr.setPlayerColor(player);
    }

    /**
     * Remove Player from room & make its color available
     * @param {Player} player
     * @constructor
     */
    public RemovePlayer(player: Player): boolean {
        const index: number = this._players.indexOf(player);
        if (index < 0) return false;
        this._players.splice(index, 1);
        player.room = null;
        this._missionDistr.resetMission(player);
        this._colorDistr.resetColor(player);
        if (this._owner === player) this.assignNewOwner();
        return true;
    }

    private assignNewOwner() {
        if (this._players.length > 0) {
            this._owner = this._players[0];
        } else {
            // Todo Destroy room
        }
    }

    /**
     * Check if room containts specific player
     * @param {Player} player
     * @returns {boolean}
     * @constructor
     */
    public ContainsPlayer(player: Player) {
        return this._players.indexOf(player) > -1;
    }

    public GetPlayersExcept(player: Player): Player[] {
        const players: Player[] = this._players;
        const index = players.indexOf(player);
        return players.slice(index);
    }

    // Grid Interaction

    public createGame(sizeX: number, sizeY: number) {
        this._serverGrid = new ServerGrid(sizeX, sizeY);
    }
    /**
     * Place Players instead of Colors as grids not displayed anyway
     * @param {Player} player
     * @param x
     * @param y
     */
    public placeTile(player: Player, x: number, y: number): IEvent[] { // IPlacedTileResponse | INotYourTurnResponse
        const roomKey = this._key;
        if (player !== this._turnManager.curPlayer()) return this.notYourTurnEvent(player, roomKey);

        if (this._serverGrid.placeTile(player, x, y)) {
            if (player.mission.check(player, this._serverGrid.grid)) {
                console.log("Player won his mission: " + player.color);
                return this.winGameEvent(roomKey, player.color);
            }
            return this.placedEvent(roomKey, player.color, x, y);

        } else {
             return this.notYourTurnEvent(player, roomKey); // ToDo change to cheat Reponse
        }
    }

    private placedEvent(roomKey: string, playerColor: string, x: number, y: number): IEvent[] {
        this._turnManager.setNextPlayer();
        const response = {response: "placedTile", roomKey, playerColor, x, y};
        const placedEvent: IEvent = {players: this._players, name: "placedTile", response};
        return [placedEvent];
    }

    private notYourTurnEvent(player: Player, roomKey: string): IEvent[] {
        const response =  {response: "notYourTurn", roomKey};
        const notYourTurnEvent: IEvent = {players: [player], name: "notYourTurn", response};
        return [notYourTurnEvent];
    }

    private winGameEvent(playerColor: string, roomKey: string): IEvent[] {
        const response =  {response: "winGame", roomKey, playerColor};
        const notYourTurnEvent: IEvent = {players: this._players, name: "winGame", response};
        return [notYourTurnEvent];
    }

}
