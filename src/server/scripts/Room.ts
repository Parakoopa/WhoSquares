import {IEvent} from "../../Event";
import {Client} from "./Client";
import {ColorDistributer} from "./ColorDistributer";
import {ServerGrid} from "./ServerGrid";

/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
 */
export class Room {

    private readonly _name: string;
    private readonly _key: string;
    private readonly _size: number;
    private _owner: Client;
    private _turnClientIndex: number = 0;
    private _clients: Client[];
    private _serverGrid: ServerGrid;
    private _colorDistr: ColorDistributer;

    constructor(name: string, key: string, size: number) {
        this._clients = [];
        this._name = name;
        this._key = key;
        this._size = size;
        this._colorDistr = new ColorDistributer();
    }

    public Name(): string {
        return this._name;
    }

    public key(): string {
        return this._key;
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
    public AddClient(client: Client): string {
        if (!this._owner) this._owner = client;
        this._clients.push(client);
        client.Room = this;
        return this._colorDistr.setClientColor(client);
    }

    /**
     * Remove Client from room & make its color available
     * @param {Client} client
     * @constructor
     */
    public RemoveClient(client: Client): void {
        const index: number = this._clients.indexOf(client);
        if (index > -1) this._clients.splice(index, 1);
        client.Room = null;
        // ResetColor
        this._colorDistr.resetColor(client);
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

    /**
     * Return all clients inside the room
     * @returns {Array<Client>}
     * @constructor
     */
    public GetClients(): Client[] {
        return this._clients;
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
        // ToDo Add Mission after each placeTile
        // ToDo Let other clients precalculate their own win, so
        // ToDo that server does not have to callcuate all the time?
        const roomKey = this._key;
        if (this._clients[this._turnClientIndex] === client) {
            if (this._serverGrid.placeTile(client, x, y)) {
                this.setNextTurnClient();
                const clientColor = client.color;
                const args = {response: "placedTile", roomKey, clientColor, x, y};
                const placedEvent = {clients: this._clients, name: "placedTile", args};
                return [placedEvent];
            } else {
                const args =  {response: "notYourTurn", roomKey};
                const notYourTurnEvent: IEvent = {clients: [client], name: "notYourTurn", args};
                return [notYourTurnEvent]; // ToDo change to cheat Reponse
            }
        } else {
            const args =  {response: "notYourTurn", roomKey};
            const notYourTurnEvent: IEvent = {clients: [client], name: "notYourTurn", args};
            return [notYourTurnEvent];
        }
    }

    public turnClient(): string {
        const client: Client = this._clients[this._turnClientIndex];
        return client.color;
    }

    private setNextTurnClient(): void {
        this._turnClientIndex += 1;
        if (this._turnClientIndex === this._clients.length) this._turnClientIndex = 0;
    }
}
