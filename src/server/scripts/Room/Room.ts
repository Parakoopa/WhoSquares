import {ObjectID} from "bson";
import {Socket} from "socket.io";
import {IEvent} from "../Event";
import {IDatabaseModel} from "../IDatabaseModel";
import {User} from "../User/User";
import {ColorDistributer} from "./Game/ColorDistributer";
import {MissionDistributer} from "./Game/MissionDistributer";
import {ServerGrid} from "./Game/ServerGrid";
import {TurnManager} from "./Game/TurnManager";
import {Player} from "./Player";
import {PlayerList} from "./PlayerList";
import {RoomEvents} from "./RoomEvents";
import {RoomRepository} from "./RoomRepository";

/**
 * A Room hosts a game for clients
 * Uses ClientMap to link player in room to the client(socket)
 * Uses ServerGrid to calculate and check tile placements & missions
 * Uses ColorDistributer to assign each player a color
 * Uses Missiondistributer to assign mission(s) to each player
 * Uses TurnManager to determine turn order of players
 */
export class Room extends RoomEvents implements IRoom, IDatabaseModel {

    public _id: ObjectID | null; // Managed by the RoomRepository - MongoDB internal id.
    /* package-private: **/
    public _owner: Player;
    /* package-private: **/
    // A room is running if a server grid exists
    /* package-private: **/
    public _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;
    private _missionDistr: MissionDistributer;
    /* package-private: **/
    public _turnManager: TurnManager;
    /* package-private: **/
    public _gameEnded: boolean;
    private static _minGridSize: number = 3;
    private static _maxGridSize: number = 10;
    private _players: PlayerList;
    /* package-private: **/
    public _replay: IReplayLogEntry[];

    constructor(private _name: string, private _key: string, maxSize: number) {
        super();
        this._players = new PlayerList(maxSize);
       // this._clientMap = new Map<Client, LocalPlayer>();
        this._colorDistr = new ColorDistributer();
        this._missionDistr = new MissionDistributer();
        this._turnManager = new TurnManager();
        this._replay = [];
    }

    /**
     *
     * @returns {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * secret key of room
     * @returns {string}
     */
    public get key(): string {
        return this._key;
    }

    public get players(): PlayerList {
        return this._players;
    }

    /**
     * Maximum amount of players allowed in room
     * @returns {number}
     */
    public get maxSize(): number {
        return this._players.maxSize;
    }

    /**
     * Client owning this room
     * @returns {Player}
     * @constructor
     */
    public Owner(): Player {
        return this._owner;
    }

    /**
     * Return the whole grid
     * @returns {IPlayer[][]}
     */
    get gridInfo(): IPlayer[][] {
        if (!this._serverGrid) return null;
        return this._serverGrid.gridInfo;
    }

    /**
     * Return NotInRoomEvent if client is not in room
     * Return NotOwnerEvent if requesting client is not room owner
     * Return NotEnoughClientsEvent if room lacks players
     * Tells room to create a game
     */
    public startGame(client: Socket, sizeX: number, sizeY: number): IEvent[] {
        const player = this._players.getPlayerForSocket(client);
        if (this._owner !== player) return [this.notOwnerEvent(client, this.name)];

        const sizes = Room.adjustGameSize(sizeX, sizeY);
        sizeX = sizes[0];
        sizeY = sizes[1];

        return this.createGame(sizeX, sizeY);
    }

    /**
     * Readjusts grid sizes to be inside minimum-maximum range
     * @param {number} sizeX
     * @param {number} sizeY
     * @returns {number[]}
     */
    private static adjustGameSize(sizeX: number, sizeY: number): number[] {
        if (sizeX > this._maxGridSize) sizeX = this._maxGridSize;
        if (sizeY > this._maxGridSize) sizeY = this._maxGridSize;
        if (sizeX < this._minGridSize) sizeX = this._minGridSize;
        if (sizeY < this._minGridSize) sizeY =  this._minGridSize;
        return [sizeX, sizeY];
    }

    /**
     * Add Client to room
     * Adds Client as Observer if game has started
     * Inform player that he has joined
     * Inform other clients that player has joined
     * @returns {string}
     * @param socket
     * @param user
     */
    public AddClient(socket: Socket, user: User): IEvent[] {
        let player: Player;
        if (this._serverGrid) {
            player = this.createObserver(socket, user);
        } else {
            player = this.createPlayer(socket, user);
        }
        this._players.push(player);
        if (!this._owner) this._owner = player;

        const otherPlayers = this._players.getPlayersExcept(player);
        const joinedEvent: IEvent =  this.joinedEvent(
            socket, this._name, this._key, player.color, otherPlayers, this.gridInfo, this._owner);
        const otherSockets =  otherPlayers.map((otherPlayer) => otherPlayer.socket);
        const otherJoinedEvent: IEvent = this.otherJoinedEvent(otherSockets, this.name, player);
        return [joinedEvent, otherJoinedEvent];
    }

    /**
     * Inform client & other clients in room that he reconnected
     * Sends room & grid information so that client may continue game
     * without reentering room etc.
     * @returns {IEvent[]}
     * @param socket
     * @param player
     */
    public reconnectClient(socket: Socket, player: Player): IEvent[] {
        player.socket = socket;
        const otherPlayers = this._players.getPlayersExcept(player);
        const joinedEvent: IEvent =  this.joinedEvent(
            socket, this._name, this._key, player.color, otherPlayers, this.gridInfo, this._owner);
        if (this._serverGrid == null) return [joinedEvent]; // No Grid (running game) => no TurnEvents
        const informTurnEvent = this.informTurnEvent(this._players.getAllSockets(), this._turnManager.curPlayer());
        return [joinedEvent, informTurnEvent];
    }

    /**
     * Create a player that may not interact with the active game
     * @param socket
     * @param user
     */
    private createObserver(socket: Socket, user: User): Player {
        const color = this._colorDistr.getFreeColor(this._players.players);
        return new Player(user, socket, color, true);
    }

    /**
     * Create a player that may interact with an active game
     * Assining color, turn order and mission
     * @param socket
     * @param user
     */
    private createPlayer(socket: Socket, user: User): Player {
        const color = this._colorDistr.getFreeColor(this._players.players);
        const player: Player = new Player(user, socket, color, true);
        player.mission = this._missionDistr.getMission();
        return player;
    }

    /**
     * Remove Client from room & make its color available
     * @param {Client} client
     * @constructor
     */
    public removeClient(client: Socket): IEvent[]  {
        const player = this._players.getPlayerForSocket(client);
        if (!player) return null;
        if (this._serverGrid) this._serverGrid.removePlayer(player);
        // if this players turn, remove it
        if (this._turnManager.curPlayer() === player) {
            this._turnManager.setNextPlayer();
            this._turnManager.removePlayer(player);
        }
        // remove client from room
        this._players.remove(player);
        if (this._owner === player) this.assignNewOwner();

        if (!player) return []; // Player was not in room?

        const leftEvent: IEvent = this.leftEvent(client, this._name);
        const otherLeftEvent: IEvent = this.otherLeftEvent(this._players.getPlayerSocketsExcept(client), this.name, player, this._owner);
        if (!this._serverGrid || this.isEmpty()) return [leftEvent, otherLeftEvent];
        const turnInfoEvent: IEvent = this.informTurnEvent(this._players.getPlayerSocketsExcept(client), this._turnManager.curPlayer());
        return [leftEvent, otherLeftEvent, turnInfoEvent];
    }

    /**
     * Check if room is empty
     * @returns {boolean}
     */
    public isEmpty(): boolean {
        return this._players.isEmpty;
    }

    /**
     * Assign new room owner if available (chronologically)
     * Room already gets deleted if emptyin lobby //Todo move delete room (this) from lobby to here?
     */
    private assignNewOwner(): void {
           const player =  this._players.first;
           if (player) this._owner = player;
    }

    /**
     * Create a grid in this room with given sizes
     * All observers are transformed to player so that can play too
     * Send startGame events to all clients in room
     * @param {number} sizeX
     * @param {number} sizeY
     * @returns {IEvent[]}
     */
    public createGame(sizeX: number, sizeY: number): IEvent[] {
        this._turnManager.reset();
        this.observerToPlayer();
        this._gameEnded = false;
        this._serverGrid = new ServerGrid(sizeX, sizeY);
        this.assignMissions();
        const startEvents: IEvent[] = this.startEvent(this._players.players, this.name, sizeX, sizeY);
        const informTurnEvent: IEvent = this.informTurnEvent(this._players.getAllSockets(), this._turnManager.curPlayer());
        startEvents.push(informTurnEvent);

        // Save this room to the DB
        RoomRepository.instance.save(this);

        return startEvents;
    }

    private assignMissions(): void {
        for (const player of this._players.players) {
            player.mission = this._missionDistr.getMission();
        }
    }

    /**
     * Transform Observer to player
     * and adds all to turnmanager order
     */
    private observerToPlayer(): void {
        for (const player of this._players.players) {
            player.isObserver = false;
            this._turnManager.addPlayer(player);
        }
    }

    /**
     * Return ObserverEvent if observer tried to place tile
     * Return NotYourTurnEvent if wrong player tried to place tile
     * Return WonEvent to all clients if player won by placing this tile
     * Return InvalidPlacementEvent if tile would have been placed invalidly
     * Otherwise inform all clients that given player has placed a tile
     * @param {Client} client
     * @param x
     * @param y
     */
    public placeTile(client: Socket, y: number, x: number): IEvent[] { // IPlacedTileResponse | INotYourTurnResponse
        if (this._gameEnded) return [this.gameAlreadyEnded(client, this._name)];
        const player: Player = this._players.getPlayerForSocket(client);
        if (!player) return [this.invalidPlayerEvent(client, this.name)];
        if (player.isObserver) {
            return [this.observerEvent(client)];
        }
        if (player !== this._turnManager.curPlayer()) {
            return [this.notYourTurnEvent(client, this.name)];
        }
        const sockets = this._players.getAllSockets();
        if (this._serverGrid.placeTile(player, y, x)) {
            const placedEvent: IEvent = this.placedEvent(sockets, this.name, player, y, x); // Also sets next client
            const winTiles = player.mission.check(player, this._serverGrid.gridInfo);
            if (winTiles.length > 0) {
                console.log("Client won his mission: " + player.color);
                this._gameEnded = true;
                return [placedEvent, this.winGameEvent(sockets, this.name, player, player.mission.name(), winTiles)];
            }
            this._turnManager.setNextPlayer();
            const curPlayer = this._turnManager.curPlayer();
            const informTurnEvent = this.informTurnEvent(sockets, curPlayer); // inform for next player color
            return [placedEvent, informTurnEvent];
        } else {
             return [this.invalidPlacement(client, this.name)];
        }
    }

    public chatMessage(client: Socket, message: string): IEvent[] {
        const player: IPlayer = this._players.getPlayerForSocket(client);
        if (!player) return [this.invalidPlayerEvent(client, this.name)];
        return [this.roomMessageEvent(this._players.getAllSockets(), this._name, player, message)];
    }

    /**
     * Count of all clients in room (players + observers)
     * @returns {number}
     */
    public size(): number {
        return this._players.size();
    }

    public hasStarted(): boolean {
        return !!this._serverGrid;
    }

    public hasEnded() {
        return this._gameEnded;
    }
}
