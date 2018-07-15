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
import {StatsManager} from "../Stats/StatsManager";

/**
 * A Room hosts a game for clients
 * Uses ClientMap to link player in room to the client(socket)
 * Uses ServerGrid to calculate and check tile placements & missions
 * Uses ColorDistributer to assign each player a color
 * Uses Missiondistributer to assign mission(s) to each player
 * Uses TurnManager to determine turn order of list
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
    public replay: IReplayLogEntry[];
    /* Only to be touched by the StatsManager */
    public stats: IRoomStats = null;
    private _turnCounter: number = 0;

    /**
     *
     * @param {string} _name
     * @param {string} _key
     * @param {number} maxSize
     */
    constructor(private _name: string, private _key: string, maxSize: number) {
        super();
        this._players = new PlayerList(maxSize);
       // this._clientMap = new Map<Client, LocalPlayer>();
        this._colorDistr = new ColorDistributer();
        this._missionDistr = new MissionDistributer();
        this._turnManager = new TurnManager();
        this.replay = [];
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
     * Maximum amount of list allowed in room
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
     * Return NotEnoughClientsEvent if room lacks list
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

        if (this.hasStarted()) {
            // Game already started so add player as observer
            player = this.createObserver(socket, user);
            // If started, include this in the replay log
            this.replay.push({player: RoomEvents.stripPlayer(player), type: "joined"} as ILogJoined);
        } else {
            player = this.createPlayer(socket, user);
        }
        this._players.push(player);
        // Add player as room owner is no room owner exists yet
        if (!this._owner) this._owner = player;

        // Create events and send them to all clients in room
        const otherPlayers = this._players.getPlayersExcept(player);
        const joinedEvent: IEvent =  this.joinedEvent(
            socket, this._name, this._key, player.color, otherPlayers, this.gridInfo, this._owner, null);
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
            socket,
            this._name,
            this._key,
            player.color,
            otherPlayers,
            this.gridInfo,
            this._owner,
            this.hasStarted() && !player.isObserver ? player.mission.constructor.name : null // Resend mission, but only if game has started
        );
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
        const color = this._colorDistr.getFreeColor(this._players.list);
        return new Player(user, socket, color, true);
    }

    /**
     * Create a player that may interact with an active game
     * Assining color, turn order and mission
     * @param socket
     * @param user
     */
    private createPlayer(socket: Socket, user: User): Player {
        const color = this._colorDistr.getFreeColor(this._players.list);
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
        if (this.hasStarted()) {
            // Remove player from game
            this._serverGrid.removePlayer(player);
            // If started, include this in the replay
            this.replay.push({player: RoomEvents.stripPlayer(player), type: "left"} as ILogLeft);
        }
        // if player is at turn, remove it
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
     * Check if room is empty (has no none-observers in it)
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

        // Tell all clients in room that game started
        const startEvents: IEvent[] = this.startEvent(this._players.list, this.name, sizeX, sizeY);
        const informTurnEvent: IEvent = this.informTurnEvent(this._players.getAllSockets(), this._turnManager.curPlayer());
        startEvents.push(informTurnEvent);

        // Save this room to the DB
        RoomRepository.instance.save(this);

        return startEvents;
    }


    private assignMissions(): void {
        for (const player of this._players.list) {
            player.mission = this._missionDistr.getMission();
        }
    }

    /**
     * Transform Observer to player
     * and adds all to turnmanager order
     */
    private observerToPlayer(): void {
        for (const player of this._players.list) {
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
    public placeTile(client: Socket, y: number, x: number): IEvent[] {

        // This block manages invalid requests
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
            // Add tile to replay
            this.replay.push({
                player: RoomEvents.stripPlayer(player),
                turnNo: ++this._turnCounter,
                type: "tilePlaced",
                x, y
            } as ILogTilePlaced);

            // Check win condition
            // Currently checked every time and not based on winGameRequest!
            const winTiles = player.mission.check(player, this._serverGrid.gridInfo);
            if (winTiles.length > 0) {
                return [placedEvent, this.processGameEnd(sockets, winTiles, player)];
            }
            this._turnManager.setNextPlayer();
            const curPlayer = this._turnManager.curPlayer();
            const informTurnEvent = this.informTurnEvent(sockets, curPlayer); // inform for next player color
            return [placedEvent, informTurnEvent];
        } else {
             return [this.invalidPlacement(client, this.name)];
        }
    }

    /**
     * Processes the end of the game
     * - Sends winner event
     * - Records winner in replay
     * - Sets game end flag
     * - Calculates room, user and global stats based on the outcome of the match.
     * @param {SocketIO.Socket[]} sockets
     * @param {ITile[]} winTiles
     * @param {Player} player
     * @returns {IEvent}
     */
    private processGameEnd(sockets: Socket[], winTiles: ITile[], player: Player): IEvent {
        console.log("Client won his mission: " + player.color);
        this._gameEnded = true;
        // Add winning to replay
        this.replay.push({player: RoomEvents.stripPlayer(player), type: "winner"} as ILogWinner);
        // Update all kinds of stats information
        StatsManager.processRoomEnd(this, player);
        return this.winGameEvent(sockets, this.name, player, player.mission.name(), winTiles);
    }

    /**
     * Distribute chat message among all clients in room
     * @param {SocketIO.Socket} client
     * @param {string} message
     * @returns {[]}
     */
    public chatMessage(client: Socket, message: string): IEvent[] {
        const player: IPlayer = this._players.getPlayerForSocket(client);
        if (!player) return [this.invalidPlayerEvent(client, this.name)];
        // Add chat message to replay
        this.replay.push({player: RoomEvents.stripPlayer(player), message, type: "chat"} as ILogChatMessage);
        return [this.roomMessageEvent(this._players.getAllSockets(), this._name, player, message)];
    }

    /**
     * Count of all clients in room (list + observers)
     * @returns {number}
     */
    public size(): number {
        return this._players.size();
    }

    /**
     *
     * @returns {boolean}
     */
    public hasStarted(): boolean {
        return !!this._serverGrid;
    }

    /**
     *
     * @returns {boolean}
     */
    public hasEnded() {
        return this._gameEnded;
    }

    /**
     *
     * @returns {number}
     */
    public getCurrentTurnNumber() {
        return this._turnCounter;
    }

    /**
     *
     * @returns {number}
     */
    public getGridSizeX() {
        return this._serverGrid.sizeX;
    }

    /**
     *
     * @returns {number}
     */
    public getGridSizeY() {
        return this._serverGrid.sizeY;
    }
}
