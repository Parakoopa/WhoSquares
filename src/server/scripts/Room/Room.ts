import {Client} from "../Client/Client";
import {LocalPlayer} from "../Client/Player/LocalPlayer";
import {Player} from "../Client/Player/Player";
import {IEvent} from "../Event";
import {ColorDistributer} from "./Game/ColorDistributer";
import {MissionDistributer} from "./Game/MissionDistributer";
import {ServerGrid} from "./Game/ServerGrid";
import {TurnManager} from "./Game/TurnManager";
import {RoomEvents} from "./RoomEvents";

/**
 * A Room hosts a game for clients
 * Uses ClientMap to link player in room to the client(socket)
 * Uses ServerGrid to calculate and check tile placements & missions
 * Uses ColorDistributer to assign each player a color
 * Uses Missiondistributer to assign mission(s) to each player
 * Uses TurnManager to determine turn order of players
 */
export class Room extends RoomEvents implements IRoom {

    private _owner: Client;
    private _clientMap: Map<Client, LocalPlayer>; // Todo Readd LocalPlayer property to client class on server
    private _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;  // Todo Readd color property to client class on server
    private _missionDistr: MissionDistributer;  // Todo mission LocalPlayer property to client class on server
    private _turnManager: TurnManager;
    private _gameEnded: boolean;

    constructor(private _name: string, private _key: string, private _maxSize: number) {
        super();
        this._clientMap = new Map<Client, LocalPlayer>();
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
        for (const localPlayer of this.localPlayers()) {
            players.push(localPlayer.player);
        }
        return players;
    }

    /**
     * Return all players of a room except the given one
     * @param {LocalPlayer} player
     * @returns {IPlayer[]}
     */
    public getPlayersExcept(player: LocalPlayer): IPlayer[] {
        const players: IPlayer[] = [];
        for (const curPlayer of  this.localPlayers()) {
            if (curPlayer !== player) {
                players.push(curPlayer.player);
            }
        }
        return players;
    }

    /**
     * All clients in room
     * @returns {Client[]}
     */
    public get clients(): Client[] {
        return Array.from(this._clientMap.keys());
    }

    /**
     * All localplayers in room
     * @returns {LocalPlayer[]}
     */
    private localPlayers(): LocalPlayer[] {
        return Array.from(this._clientMap.values());
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
     * @returns {Client}
     * @constructor
     */
    public Owner(): Client {
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
     * Add Client to room
     * Adds Client as Observer if game has started
     * Inform player that he has joined
     * Inform other clients that player has joined
     * @param {Client} client
     * @returns {string}
     * @constructor
     */
    public AddClient(client: Client): IEvent[] { // ToDo make string into color enum
        client.room = this;
        if (!this._owner) this._owner = client;
        let localPlayer: LocalPlayer = this._clientMap.get(client);
        if (this._serverGrid) {
            localPlayer = this.createObserver(client);
            // ToDo Add InformTurn for Observer
        } else {
            localPlayer = this.createPlayer(client);
        }
        const otherPlayers = this.getPlayersExcept(localPlayer);
        const joinedEvent: IEvent =  this.joinedEvent(
            client, this._name, this._key, localPlayer.player.color, otherPlayers, this.gridInfo);
        const otherClients = this.getClientsExcept(client);
        const otherJoinedEvent: IEvent = this.otherJoinedEvent(otherClients, this.name, localPlayer);
        return [joinedEvent, otherJoinedEvent];
    }

    /**
     * Inform client & other clients in room that he reconnected
     * Sends room & grid information so that client may continue game
     * without reentering room etc.
     * @param {Client} client
     * @returns {IEvent[]}
     */
    public reconnectClient(client: Client): IEvent[] {
        const localPlayer = this._clientMap.get(client);
        const otherPlayers = this.getPlayersExcept(localPlayer);
        const joinedEvent: IEvent =  this.joinedEvent(
            client, this._name, this._key, localPlayer.player.color, otherPlayers, this.gridInfo);
        const otherClients = this.getClientsExcept(client);
        const otherJoinedEvent = this.otherJoinedEvent(otherClients, this.name, localPlayer);
        const informTurnEvent = this.informTurnEvent(this.clients, this._turnManager.curClient().player);
        return [joinedEvent, otherJoinedEvent, informTurnEvent];
    }

    /**
     * Create a player that may not interact with the active game
     * @param {Client} client
     * @returns {LocalPlayer}
     */
    private createObserver(client: Client): LocalPlayer {
        // ToDo Observers do not need game colors or missions
        const color = this._colorDistr.getFreeColor();
        const mission = this._missionDistr.getMission();
        const player: Player = new Player(client.name, color);
        const localPlayer = new LocalPlayer(player, this, mission);
        localPlayer.player.isObserver = true;
        this._clientMap.set(client, localPlayer);
        return localPlayer;
    }

    /**
     * Create a player that may interact with an active game
     * Assining color, turn order and mission
     * @param {Client} client
     * @returns {LocalPlayer}
     */
    private createPlayer(client: Client): LocalPlayer {
        const color = this._colorDistr.getFreeColor();
        const mission = this._missionDistr.getMission();
        const player: Player = new Player(client.name, color);
        const localPlayer = new LocalPlayer(player, this, mission);
        this._clientMap.set(client, localPlayer);
        this._turnManager.addClient(localPlayer);
        return localPlayer;
    }

    /**
     * Remove Client from room & make its color available
     * @param {Client} client
     * @constructor
     */
    public removeClient(client: Client): IPlayer {
        const localPlayer = this._clientMap.get(client);
        if (localPlayer === undefined) return null; // todo think of spectators
        // ToDo somehow flag disconnected players for client to be displayed that way
        this._colorDistr.resetColor(this._clientMap.get(client).player.color);
        if(this._serverGrid) this._serverGrid.removePlayer(this._clientMap.get(client).player);
        this._clientMap.delete(client);
        if (this._owner === client) this.assignNewOwner();
        return localPlayer.player;
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
            this._owner = this.clients[0]; // Todo find better way to select new owner
        } else {
            // Todo Destroy room
        }
    }

    /**
     * Returns all clients except the given one
     * @param {Client} client
     * @returns {Client[]}
     */
    public getClientsExcept(client: Client): Client[] {
        const clients: Client[] = [];
        for (const curClient of this.clients) {
            if (client !== curClient) clients.push(curClient);
        }
        return clients;
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
        const startEvent: IEvent = this.startEvent(this.clients, this.name, sizeX, sizeY);
        const informTurnEvent: IEvent = this.informTurnEvent(this.clients, this._turnManager.curClient().player);
        return [startEvent, informTurnEvent];
    }

    /**
     * Transform Observer to player
     */
    private observerToPlayer(): void {
        for (const localPlayer of this.localPlayers()) {
            localPlayer.player.isObserver = false;
            this._turnManager.addClient(localPlayer);
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
    public placeTile(client: Client, y: number, x: number): IEvent[] { // IPlacedTileResponse | INotYourTurnResponse
        if (this._gameEnded) return [this.gameAlreadyEnded(client, this._name)];
        const localPlayer: LocalPlayer = this._clientMap.get(client);
        if (localPlayer.player.isObserver) {
            return [this.observerEvent(client)];
        }
        if (localPlayer !== this._turnManager.curClient()) {
            return [this.notYourTurnEvent(client, this.name)];
        }
        if (this._serverGrid.placeTile(localPlayer.player, y, x)) {
            const placedEvent: IEvent = this.placedEvent(this.clients, this.name, localPlayer.player, y, x); // Also sets next client
            if (localPlayer.mission.check(localPlayer.player, this._serverGrid.gridInfo)) {
                console.log("Client won his mission: " + localPlayer.player.color);
                this._gameEnded = true;
                return [placedEvent, this.winGameEvent(this.clients, this.name, localPlayer.player)];
            }
            this._turnManager.setNextClient();
            const player = this._turnManager.curClient().player;
            const informTurnEvent = this.informTurnEvent(this.clients, player); // inform for next player color
            return [placedEvent, informTurnEvent];
        } else {
             return [this.invalidPlacement(client, this.name)]; // ToDo change to cheat Response
        }
    }

    public chatMessage(client: Client, message: string): IEvent[] {
        const player: IPlayer = this._clientMap.get(client).player;
        return [this.roomMessageEvent(this.clients, this._name, player, message)];
    }

    /**
     * Count of all clients in room (players + observers)
     * @returns {number}
     */
    private size(): number {
        return Array.from(this._clientMap.keys()).length;
    }

}
