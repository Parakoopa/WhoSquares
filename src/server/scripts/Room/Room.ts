import {IEvent} from "../Event";
import {ColorDistributer} from "./Game/ColorDistributer";
import {MissionDistributer} from "./Game/MissionDistributer";
import {ServerGrid} from "./Game/ServerGrid";
import {TurnManager} from "./Game/TurnManager";
import {RoomEvents} from "./RoomEvents";
import {Player} from "./Player";
import {Socket} from "socket.io";

/**
 * A Room hosts a game for clients
 * Uses ClientMap to link player in room to the client(socket)
 * Uses ServerGrid to calculate and check tile placements & missions
 * Uses ColorDistributer to assign each player a color
 * Uses Missiondistributer to assign mission(s) to each player
 * Uses TurnManager to determine turn order of players
 */
export class Room extends RoomEvents implements IRoom {

    private _owner: Player;
    private _players: Player[];
    // A room is running if a server grid exists
    private _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;
    private _missionDistr: MissionDistributer;
    private _turnManager: TurnManager;
    private _gameEnded: boolean;
    private static _minGridSize: number = 3;
    private static _maxGridSize: number = 10;

    constructor(private _name: string, private _key: string, private _maxSize: number) {
        super();
        this._players = [];
       // this._clientMap = new Map<Client, LocalPlayer>();
        this._colorDistr = new ColorDistributer();
        this._missionDistr = new MissionDistributer();
        this._turnManager = new TurnManager();
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

    /**
     * Transform LocalPlayers into IPlayer
     * to avoid sending secret-keys
     * @returns {IPlayer[]}
     */
    public get players(): IPlayer[] {
        const players: IPlayer[] = [];
        for (const player of this._players) {
            players.push(player);
        }
        return players;
    }

    /**
     * Return all players of a room except the given one
     * @param {Player} player
     * @returns {Player[]}
     */
    public getPlayersExcept(player: IPlayer): Player[] {
        const players: Player[] = [];
        for (const needle of  this._players) {
            if (needle !== player) {
                players.push(needle);
            }
        }
        return players;
    }

    /**
     * Maximum amount of players allowed in room
     * @returns {number}
     */
    public get maxSize(): number {
        return this._maxSize;
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
        const player = this.getPlayerForSocket(client);
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
     * @param playerKey
     * @param playerName
     */
    public AddClient(socket: Socket, playerKey: string, playerName: string): IEvent[] {
        let player: Player;
        if (this._serverGrid) {
            player = this.createObserver(socket, playerKey, playerName);
        } else {
            player = this.createPlayer(socket, playerKey, playerName);
        }
        this._players.push(player);
        if (!this._owner) this._owner = player;

        const otherPlayers = this.getPlayersExcept(player);
        const joinedEvent: IEvent =  this.joinedEvent(
            socket, this._name, this._key, player.color, otherPlayers, this.gridInfo);
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
        const otherPlayers = this.getPlayersExcept(player);
        const joinedEvent: IEvent =  this.joinedEvent(
            socket, this._name, this._key, player.color, otherPlayers, this.gridInfo);
        const otherClients = this.getPlayerSocketsExcept(player.socket);
        const otherJoinedEvent = this.otherJoinedEvent(otherClients, this.name, player);
        if (this._serverGrid == null) return [joinedEvent, otherJoinedEvent]; // No Grid (running game) => no TurnEvents
        const informTurnEvent = this.informTurnEvent(this._players.map((pl) => pl.socket), this._turnManager.curClient());
        return [joinedEvent, otherJoinedEvent, informTurnEvent];
    }

    /**
     * Create a player that may not interact with the active game
     * @param socket
     * @param key
     * @param name
     */
    private createObserver(socket: Socket, key: string, name: string): Player {
        const color = this._colorDistr.getFreeColor(this._players);
        return new Player(name, key, socket, color, true);
    }

    /**
     * Create a player that may interact with an active game
     * Assining color, turn order and mission
     * @param socket
     * @param key
     * @param name
     */
    private createPlayer(socket: Socket, key: string, name: string): Player {
        const color = this._colorDistr.getFreeColor(this._players);
        const player: Player = new Player(name, key, socket, color, true);
        player.mission = this._missionDistr.getMission();
        return player;
    }

    /**
     * Remove Client from room & make its color available
     * @param {Client} client
     * @constructor
     */
    public removeClient(client: Socket): IPlayer {
        if (client.player === undefined) return null; // todo think of spectators
        // ToDo somehow flag disconnected players for client to be displayed that way
        if (this._serverGrid) this._serverGrid.removePlayer(client.player);
        // remove client from room
        const index = this._players.indexOf(client);
        if (index > -1)this._players.splice(index);
        if (this._owner === client) this.assignNewOwner();
        return client.player;
    }

    /**
     * Check if room is empty
     * @returns {boolean}
     */
    public isEmpty(): boolean {
        return this.size() === 0;
    }

    /**
     * Assign new room owner if available (chronologically)
     * Room already gets deleted if emptyin lobby //Todo move delete room (this) from lobby to here?
     */
    private assignNewOwner() {
        if (this.size() > 0) {
            this._owner = this._players[0]; // Todo find better way to select new owner
        } else {
            // Todo Destroy room
        }
    }

    /**
     * Returns all sockets for players except the given one
     * @param {Socket} socket
     * @returns {Socket[]}
     */
    public getPlayerSocketsExcept(socket: Socket): Socket[] {
        const sockets: Socket[] = [];
        for (const curPlayer of this._players) {
            if (socket !== curPlayer.socket) sockets.push(curPlayer.socket);
        }
        return sockets;
    }

    public getPlayerByKey(playerKey: string): Player | null {
        for (const player of this._players) {
            if (playerKey === player.key) return player;
        }
        return null;
    }

    public getPlayerForSocket(socket: Socket): Player {
        for (const player of this._players) {
            if (socket === player.socket) return player;
        }
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
        const startEvents: IEvent[] = this.startEvent(this._players, this.name, sizeX, sizeY);
        const informTurnEvent: IEvent = this.informTurnEvent(this._players, this._turnManager.curClient().player);
        startEvents.push(informTurnEvent);
        return startEvents;
    }

    private assignMissions(): void {
        for (const player of this._players) {
            player.mission = this._missionDistr.getMission();
        }
    }

    /**
     * Transform Observer to player
     * and adds all to turnmanager order
     */
    private observerToPlayer(): void {
        for (const player of this._players) {
            player.isObserver = false;
            this._turnManager.addClient(player);
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
        const player: IPlayer = client.player;
        if (player.isObserver) {
            return [this.observerEvent(client)];
        }
        if (client !== this._turnManager.curClient()) {
            return [this.notYourTurnEvent(client, this.name)];
        }
        if (this._serverGrid.placeTile(player, y, x)) {
            const placedEvent: IEvent = this.placedEvent(this._players, this.name, player, y, x); // Also sets next client
            if (client.mission.check(player, this._serverGrid.gridInfo)) {
                console.log("Client won his mission: " + player.color);
                this._gameEnded = true;
                return [placedEvent, this.winGameEvent(this._players, this.name, player)];
            }
            this._turnManager.setNextClient();
            const curPlayer = this._turnManager.curClient().player;
            const informTurnEvent = this.informTurnEvent(this._players, curPlayer); // inform for next player color
            return [placedEvent, informTurnEvent];
        } else {
             return [this.invalidPlacement(client, this.name)]; // ToDo change to cheat Response
        }
    }

    public chatMessage(client: Socket, message: string): IEvent[] {
        const player: IPlayer = client.player;
        return [this.roomMessageEvent(this._players, this._name, player, message)];
    }

    /**
     * Count of all clients in room (players + observers)
     * @returns {number}
     */
    public size(): number {
        return this._players.length;
    }
}
