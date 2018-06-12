import {Client} from "../Client/Client";
import {LocalPlayer} from "../Client/LocalPlayer";
import {Player} from "../Client/Player";
import {IEvent} from "../Event";
import {ColorDistributer} from "./Game/ColorDistributer";
import {MissionDistributer} from "./Game/MissionDistributer";
import {ServerGrid} from "./Game/ServerGrid";
import {TurnManager} from "./Game/TurnManager";

/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
 */
export class Room implements IRoom {

    private _owner: Client;
    private _clientMap: Map<Client, LocalPlayer>;
    private _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;
    private _missionDistr: MissionDistributer;
    private _turnManager: TurnManager;
    private _discconnectCount: number = 0;

    constructor(private _name: string, private _key: string, private _maxSize: number) {
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
        client.addRoom(this);
        if (!this._owner) this._owner = client;
        let localPlayer: LocalPlayer = this._clientMap.get(client);
        if (localPlayer) this._discconnectCount--; // Return reconnected player
        else if (this._serverGrid) {
            localPlayer = this.createObserver(client);
        } else {
            localPlayer = this.createPlayer(client);
        }
        const joinedEvent: IEvent = this.joinedEvent(client, localPlayer);
        const otherJoinedEvent: IEvent = this.otherJoinedEvent(client, localPlayer);
        return [joinedEvent, otherJoinedEvent];
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

    private joinedEvent(client: Client, localPlayer: LocalPlayer): IEvent {
        const response: IJoinedResponse = {
            response: "joinedRoom",
            roomName: this._name,
            roomKey: this._key,
            color: localPlayer.player.color,
            otherPlayers: this.getPlayersExcept(localPlayer),
            gridInfo: this.gridInfo
        };
        return{clients: [client], name: "joinedRoom", response};
    }

    private otherJoinedEvent(client: Client, localPlayer: LocalPlayer): IEvent {
        const response: IOtherJoinedResponse = {response: "otherJoinedRoom", otherPlayer: localPlayer.player};
        return {clients: this.getClientsExcept(client), name: "otherJoinedRoom", response};

    }
    /**
     * Remove Client from room & make its color available
     * @param {Client} client
     * @constructor
     */
    public RemoveClient(client: Client): boolean {
        const isContained: boolean = this._clientMap.get(client) !== undefined; // todo think of spectators
        if (this._owner === client) this.assignNewOwner();
        this._discconnectCount++;
        // player may rejoin a room at any time, so valuesdo not get reset
        // this._colorDistr.resetColor(client);
        // this._clientMap.set(client, null);
        return isContained;
    }

    public isEmpty(): boolean {
        //console.log("player: " + this.size() + " - disconnects: " + this._discconnectCount);
        return this.size() <= this._discconnectCount;
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
    public createGame(sizeX: number, sizeY: number) {
        this._turnManager.reset();
        this.observerToPlayer();
        this._serverGrid = new ServerGrid(sizeX, sizeY);
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
    public placeTile(client: Client, x: number, y: number): IEvent[] { // IPlacedTileResponse | INotYourTurnResponse
        const roomKey = this._key;
        const localPlayer: LocalPlayer = this._clientMap.get(client);
        if (localPlayer.player.isObserver) {
            return this.observerEvent(client);
        }
        if (localPlayer !== this._turnManager.curClient()) {
            return this.notYourTurnEvent(client, roomKey);
        }
        if (this._serverGrid.placeTile(localPlayer.player, x, y)) {
            if (localPlayer.mission.check(localPlayer.player, this._serverGrid.gridInfo)) {
                console.log("Client won his mission: " + localPlayer.player.color);
                return this.winGameEvent(roomKey, localPlayer.player);
            }
            const placedEvent: IEvent = this.placedEvent(roomKey, localPlayer.player, x, y); // Also sets next client
            const informTurnEvent = this.informTurnEvent(); // inform for next player color
            return [placedEvent, informTurnEvent];
        } else {
             return this.notYourTurnEvent(client, roomKey); // ToDo change to cheat Reponse
        }
    }

    public observerEvent(client: Client): IEvent[] {
        const observerResponse: IObserverResponse = {response: "observer"};
        return [{clients: [client], name: "observer", response: observerResponse}];
    }

    public informTurnEvent(): IEvent {
        const informResponse =   {response: "informTurn", player: this._turnManager.curClient().player};
        return {clients: this.clients, name: "informTurn", response: informResponse};
    }

    private placedEvent(roomKey: string, player: IPlayer, x: number, y: number): IEvent {
        this._turnManager.setNextClient();
        const response: IPlacedTileResponse = {response: "placedTile", roomKey, player, x, y};
        const placedEvent: IEvent = {clients: this.clients, name: "placedTile", response};
        return placedEvent;
    }

    private notYourTurnEvent(client: Client, roomKey: string): IEvent[] {
        const response =  {response: "notYourTurn", roomKey};
        const notYourTurnEvent: IEvent = {clients: [client], name: "notYourTurn", response};
        return [notYourTurnEvent];
    }

    private winGameEvent(roomKey: string, player: IPlayer): IEvent[] {
        const response: IWinGameResponse =  {response: "winGame", roomKey, player};
        const winGameEvent: IEvent = {clients: this.clients, name: "winGame", response};
        return [winGameEvent];
    }

    private size(): number {
        return Array.from(this._clientMap.keys()).length;
    }

}
