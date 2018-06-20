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
 * Each client gets a color assigned
 */
export class Room extends RoomEvents implements IRoom {

    private _owner: Client;
    private _clientMap: Map<Client, LocalPlayer>;
    private _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;
    private _missionDistr: MissionDistributer;
    private _turnManager: TurnManager;

    constructor(private _name: string, private _key: string, private _maxSize: number) {
        super();
        this._clientMap = new Map<Client, LocalPlayer>();
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

    public get players(): IPlayer[] {
        const players: IPlayer[] = [];
        for (const localPlayer of this.localPlayers()) {
            players.push(localPlayer.player);
        }
        return players;
    }

    public getPlayersExcept(player: LocalPlayer): IPlayer[] {
        const players: IPlayer[] = [];
        for (const curPlayer of  this.localPlayers()) {
            if (curPlayer !== player) {
                players.push(curPlayer.player);
            }
        }
        return players;
    }

    public get clients(): Client[] {
        return Array.from(this._clientMap.keys());
    }

    private localPlayers(): LocalPlayer[] {
        return Array.from(this._clientMap.values());
    }

    public get maxSize(): number {
        return this._maxSize;
    }

    public Owner(): Client {
        return this._owner;
    }

    get gridInfo(): IPlayer[][] {
        if (!this._serverGrid) return null;
        return this._serverGrid.gridInfo;
    }

    /**
     * Add Client & assign/return its color
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
    public RemoveClient(client: Client): IPlayer {
        const localPlayer = this._clientMap.get(client);
        if (localPlayer === undefined) return null; // todo think of spectators
        // ToDo somehow flag disconnected players for client to be displayed that way
        this._colorDistr.resetColor(this._clientMap.get(client).player.color);
        this._clientMap.delete(client);
        if (this._owner === client) this.assignNewOwner();
        return localPlayer.player;
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }
    private assignNewOwner() {
        if (this.size() > 0) {
            this._owner = this.clients[0]; // Todo find better way to select new owner
        } else {
            // Todo Destroy room
        }
    }

    public getClientsExcept(client: Client): Client[] {
        const clients: Client[] = [];
        for (const curClient of this.clients) {
            if (client !== curClient) clients.push(curClient);
        }
        return clients;
    }

    // Grid Interaction
    public createGame(sizeX: number, sizeY: number): IEvent[] {
        this._turnManager.reset();
        this.observerToPlayer();
        this._serverGrid = new ServerGrid(sizeX, sizeY);
        const startEvent: IEvent = this.startEvent(this.clients, this.name, sizeX, sizeY);
        const informTurnEvent: IEvent = this.informTurnEvent(this.clients, this._turnManager.curClient().player);
        return [startEvent, informTurnEvent];
    }

    private observerToPlayer(): void {
        for (const localPlayer of this.localPlayers()) {
            localPlayer.player.isObserver = false;
            this._turnManager.addClient(localPlayer);
        }
    }

    /**
     * Place Clients instead of Colors as grids not displayed anyway
     * @param {Client} client
     * @param x
     * @param y
     */
    public placeTile(client: Client, y: number, x: number): IEvent[] { // IPlacedTileResponse | INotYourTurnResponse
        const localPlayer: LocalPlayer = this._clientMap.get(client);
        if (localPlayer.player.isObserver) {
            return [this.observerEvent(client)];
        }
        if (localPlayer !== this._turnManager.curClient()) {
            return [this.notYourTurnEvent(client, this.name)];
        }
        if (this._serverGrid.placeTile(localPlayer.player, y, x)) {
            if (localPlayer.mission.check(localPlayer.player, this._serverGrid.gridInfo)) {
                console.log("Client won his mission: " + localPlayer.player.color);
                return [this.winGameEvent(this.clients, this.name, localPlayer.player)];
            }
            const placedEvent: IEvent = this.placedEvent(this.clients, this.name, localPlayer.player, y, x); // Also sets next client
            this._turnManager.setNextClient();
            const player = this._turnManager.curClient().player;
            const informTurnEvent = this.informTurnEvent(this.clients, player); // inform for next player color
            return [placedEvent, informTurnEvent];
        } else {
             return [this.invalidPlacement(client, this.name)]; // ToDo change to cheat Reponse
        }
    }

    private size(): number {
        return Array.from(this._clientMap.keys()).length;
    }

}
