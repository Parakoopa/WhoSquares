import {Client} from "../Client/Client";
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
    private readonly _clients: Client[];
    private _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;
    private _missionDistr: MissionDistributer;
    private _turnManager: TurnManager;

    constructor(private _name: string, private _key: string, private _maxSize: number) {
        this._clients = [];
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
        for (const client of this._clients) {
            players.push(client.player);
        }
        return players;
    }

    public getPlayersExcept(client: IPlayer): IPlayer[] {
        const players: IPlayer[] = [];
        for (const curClient of this.clients) {
            if (client !== curClient) players.push(curClient.player);
        }
        return players;
    }

    public get clients(): Client[] {
        return this._clients;
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
    public AddClient(client: Client): number { // ToDo make string into color enum
        if (!this._owner) this._owner = client;
        client.room = this;
        this._clients.push(client);
        this._turnManager.addClient(client);
        this._missionDistr.setMission(client);
        return this._colorDistr.setClientColor(client);
    }

    /**
     * Remove Client from room & make its color available
     * @param {Client} client
     * @constructor
     */
    public RemoveClient(client: Client): boolean {
        const index: number = this._clients.indexOf(client);
        if (index < 0) return false;
        console.log("index: " + index);
        console.log("beforte splice" + this._clients.length);
        this._clients.splice(index, 1);
        console.log("After splice: " + this._clients.length);
        client.room = null;
        this._missionDistr.resetMission(client);
        this._colorDistr.resetColor(client);
        if (this._owner === client) this.assignNewOwner();
        return true;
    }

    private assignNewOwner() {
        if (this._clients.length > 0) {
            console.log(this._owner.name);
            console.log(this._clients[0].name);
            this._owner = this._clients[0];
        } else {
            // Todo Destroy room
        }
    }

    /**
     * Check if room containts specific client
     * @param {Client} client
     * @returns {boolean}
     * @constructor
     */
    public containsClient(client: Client) {
        return this._clients.indexOf(client) > -1;
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
        this._serverGrid = new ServerGrid(sizeX, sizeY);
    }

    /**
     * Place Clients instead of Colors as grids not displayed anyway
     * @param {Client} client
     * @param x
     * @param y
     */
    public placeTile(client: Client, x: number, y: number): IEvent[] { // IPlacedTileResponse | INotYourTurnResponse
        const roomKey = this._key;
        if (client !== this._turnManager.curClient()) return this.notYourTurnEvent(client, roomKey);

        if (this._serverGrid.placeTile(client, x, y)) {
            if (client.mission.check(client, this._serverGrid.gridInfo)) {
                console.log("Client won his mission: " + client.color);
                return this.winGameEvent(roomKey, client.player);
            }
            const placedEvent: IEvent = this.placedEvent(roomKey, client.player, x, y); // Also sets next client
            const informTurnEvent = this.informTurnEvent(client.room.clients, this._turnManager.curClient().player); // inform for next player color
            return [placedEvent, informTurnEvent];
        } else {
             return this.notYourTurnEvent(client, roomKey); // ToDo change to cheat Reponse
        }
    }

    public informTurnEvent(clients: Client[], player: IPlayer): IEvent {
        const informResponse =   {response: "informTurn", player};
        return {clients, name: "informTurn", response: informResponse};
    }

    private placedEvent(roomKey: string, player: IPlayer, x: number, y: number): IEvent {
        this._turnManager.setNextClient();
        const response: IPlacedTileResponse = {response: "placedTile", roomKey, player, x, y};
        const placedEvent: IEvent = {clients: this._clients, name: "placedTile", response};
        return placedEvent;
    }

    private notYourTurnEvent(client: Client, roomKey: string): IEvent[] {
        const response =  {response: "notYourTurn", roomKey};
        const notYourTurnEvent: IEvent = {clients: [client], name: "notYourTurn", response};
        return [notYourTurnEvent];
    }

    private winGameEvent(roomKey: string, player: IPlayer): IEvent[] {
        const response: IWinGameResponse =  {response: "winGame", roomKey, player};
        const winGameEvent: IEvent = {clients: this._clients, name: "winGame", response};
        return [winGameEvent];
    }

}
