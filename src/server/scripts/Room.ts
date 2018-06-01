import {Client} from "./Client";
import {ColorDistributer} from "./ColorDistributer";
import {MissionDistributer} from "./MissionDistributer";
import {ServerGrid} from "./ServerGrid";
import {TurnManager} from "./TurnManager";
import {IEvent} from "./Event";

/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
 */
export class Room implements IRoom {

    private readonly _key: string;
    private readonly _size: number;
    private _name: string;
    private _owner: Client;
    private readonly _clients: Client[];
    private _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;
    private _missionDistr: MissionDistributer;
    private _turnManager: TurnManager;

    constructor(name: string, key: string, size: number) {
        this._clients = [];
        this._name = name;
        this._key = key;
        this._size = size;
        this._colorDistr = new ColorDistributer();
        this._missionDistr = new MissionDistributer();
        this._turnManager = new TurnManager();
    }

    public getKey(): string {
        return this._key;
    }

    public getName(): string {
        return this._name;
    }

    public getClients(): Client[] {
        return this._clients;
    }

    public Size(): number {
        return this._size;
    }

    public Owner(): Client {
        return this._owner;
    }

    get grid(): ServerGrid {
        return this._serverGrid;
    }

    set grid(value: ServerGrid) {
        this._serverGrid = value;
    }

    /**
     * Add Client & assign/return its color
     * @param {Client} client
     * @returns {string}
     * @constructor
     */
    public AddClient(client: Client): string { // ToDo make string into color enum
        if (!this._owner) this._owner = client;
        client.setRoom(this);
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
        this._clients.splice(index, 1);
        client.setRoom(null);
        this._missionDistr.resetMission(client);
        this._colorDistr.resetColor(client);
        return true;
    }

    /**
     * Check if room containts specific client
     * @param {Client} client
     * @returns {boolean}
     * @constructor
     */
    public ContainsClient(client: Client) {
        return this._clients.indexOf(client) > -1;
    }

    // Grid Interaction

    public createGame(sizeX: number, sizeY: number) {
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
            if (client.getMission().check(client, this._serverGrid.grid)) {
                console.log("Client won his mission: " + client.getColor());
                return this.winGameEvent(roomKey, client.getColor());
            }
            return this.placedEvent(roomKey, client.getColor(), x, y);

        } else {
             return this.notYourTurnEvent(client, roomKey); // ToDo change to cheat Reponse
        }
    }

    private placedEvent(roomKey: string, clientColor: string, x: number, y: number): IEvent[] {
        this._turnManager.setNextClient();
        const response = {response: "placedTile", roomKey, clientColor, x, y};
        const placedEvent: IEvent = {clients: this._clients, name: "placedTile", response};
        return [placedEvent];
    }

    private notYourTurnEvent(client: Client, roomKey: string): IEvent[] {
        const response =  {response: "notYourTurn", roomKey};
        const notYourTurnEvent: IEvent = {clients: [client], name: "notYourTurn", response};
        return [notYourTurnEvent];
    }

    private winGameEvent(clientColor: string, roomKey: string): IEvent[] {
        const response =  {response: "winGame", roomKey, clientColor};
        const notYourTurnEvent: IEvent = {clients: this._clients, name: "winGame", response};
        return [notYourTurnEvent];
    }

}
