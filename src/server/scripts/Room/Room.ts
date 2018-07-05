import {Client} from "../Client/Client";
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
    private _clients: Client[];
  //  private _clientMap: Map<Client, LocalPlayer>; // Todo Readd LocalPlayer property to client class on server
    private _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;  // Todo Readd color property to client class on server
    private _missionDistr: MissionDistributer;  // Todo mission LocalPlayer property to client class on server
    private _turnManager: TurnManager;
    private _gameEnded: boolean;

    constructor(private _name: string, private _key: string, private _maxSize: number) {
        super();
        this._clients = [];
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
        for (const client of this._clients) {
            players.push(client.player);
        }
        return players;
    }

    /**
     * Return all players of a room except the given one
     * @param {LocalPlayer} player
     * @returns {IPlayer[]}
     */
    public getPlayersExcept(player: IPlayer): IPlayer[] {
        const players: IPlayer[] = [];
        for (const client of  this._clients) {
            if (client.player !== player) {
                players.push(client.player);
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
        this._clients.push(client);
        if (!this._owner) this._owner = client;
        if (this._serverGrid) {
            this.createObserver(client);
        } else {
            this.createPlayer(client);
        }
        const otherPlayers = this.getPlayersExcept(client.player);
        const joinedEvent: IEvent =  this.joinedEvent(
            client, this._name, this._key, client.player.color, otherPlayers, this.gridInfo);
        const otherClients = this.getClientsExcept(client);
        const otherJoinedEvent: IEvent = this.otherJoinedEvent(otherClients, this.name, client.player);
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
        const player = client.player;
        const otherPlayers = this.getPlayersExcept(player);
        const joinedEvent: IEvent =  this.joinedEvent(
            client, this._name, this._key, player.color, otherPlayers, this.gridInfo);
        const otherClients = this.getClientsExcept(client);
        const otherJoinedEvent = this.otherJoinedEvent(otherClients, this.name, player);
        if (this._serverGrid == null) return [joinedEvent, otherJoinedEvent]; // No Grid (running game) => no TurnEvents
        const informTurnEvent = this.informTurnEvent(this._clients, this._turnManager.curClient().player);
        return [joinedEvent, otherJoinedEvent, informTurnEvent];
    }

    /**
     * Create a player that may not interact with the active game
     * @param {Client} client
     */
    private createObserver(client: Client): void {
        client.player.color = this._colorDistr.getFreeColor();
        client.player.isObserver = true;
    }

    /**
     * Create a player that may interact with an active game
     * Assining color, turn order and mission
     * @param {Client} client
     */
    private createPlayer(client: Client): void {
        client.player.color = this._colorDistr.getFreeColor();
        client.player.isObserver = true;
        client.mission = this._missionDistr.getMission();
    }

    /**
     * Remove Client from room & make its color available
     * @param {Client} client
     * @constructor
     */
    public removeClient(client: Client): IPlayer {
        if (client.player === undefined) return null; // todo think of spectators
        // ToDo somehow flag disconnected players for client to be displayed that way
        this._colorDistr.resetColor(client.player.color);
        if (this._serverGrid) this._serverGrid.removePlayer(client.player);
        // remove client from room
        const index = this._clients.indexOf(client);
        if (index > -1)this._clients.splice(index);
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
            this._owner = this._clients[0]; // Todo find better way to select new owner
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
        for (const curClient of this._clients) {
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
        this.assignMissions();
        const startEvents: IEvent[] = this.startEvent(this._clients, this.name, sizeX, sizeY);
        const informTurnEvent: IEvent = this.informTurnEvent(this._clients, this._turnManager.curClient().player);
        startEvents.push(informTurnEvent);
        return startEvents;
    }

    private assignMissions(): void {
        for (const client of this._clients) {
            client.mission = this._missionDistr.getMission();
        }
    }

    /**
     * Transform Observer to player
     * and adds all to turnmanager order
     */
    private observerToPlayer(): void {
        for (const client of this._clients) {
            client.player.isObserver = false;
            this._turnManager.addClient(client);
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
        const player: IPlayer = client.player;
        if (player.isObserver) {
            return [this.observerEvent(client)];
        }
        if (client !== this._turnManager.curClient()) {
            return [this.notYourTurnEvent(client, this.name)];
        }
        if (this._serverGrid.placeTile(player, y, x)) {
            const placedEvent: IEvent = this.placedEvent(this._clients, this.name, player, y, x); // Also sets next client
            if (client.mission.check(player, this._serverGrid.gridInfo)) {
                console.log("Client won his mission: " + player.color);
                this._gameEnded = true;
                return [placedEvent, this.winGameEvent(this._clients, this.name, player)];
            }
            this._turnManager.setNextClient();
            const curPlayer = this._turnManager.curClient().player;
            const informTurnEvent = this.informTurnEvent(this._clients, curPlayer); // inform for next player color
            return [placedEvent, informTurnEvent];
        } else {
             return [this.invalidPlacement(client, this.name)]; // ToDo change to cheat Response
        }
    }

    public chatMessage(client: Client, message: string): IEvent[] {
        const player: IPlayer = client.player;
        return [this.roomMessageEvent(this._clients, this._name, player, message)];
    }

    /**
     * Count of all clients in room (players + observers)
     * @returns {number}
     */
    public size(): number {
        return this._clients.length;
    }

}
