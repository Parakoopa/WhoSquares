import {Client} from "./Client";
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
    private _clientColorMap: Map<string, Client>;
    private readonly _colors: string[] =
        ["FF3333", "FF9933", "FFFF33", "00FF00", "33FFFF", "9933FF", "FF33FF", "FF3399", "FF33FF"];
        // ["red", "orange", "yellow", "green", "lightblue", "darkblue", "purple", "pink", ToDo "grey", "black", "white"];

    constructor(name: string, key: string, size: number) {
        this._clients = [];
        this._name = name;
        this._key = key;
        this._size = size;
        this._clientColorMap = new Map();
        this.SetColors();
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
        const color: string = this.GetUnassignedColor();
        this._clientColorMap.set(color, client);
        return color;
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
        this.ResetColor(client);
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

    /**
     * Return the room color of a specific client
     * @param {Client} client
     * @returns {string}
     * @constructor
     */
    public GetClientColor(client: Client): string {
        for (const color of this._colors) {
            if (this._clientColorMap.get(color) === client) return color;
        }
        return null; // Should not be null, but can be improved?
    }

    /**
     * Initialize all available color
     * => Somehow add them on definition of _clientColorMap!
     * @constructor
     */
    private SetColors(): void {
        for (const color of this._colors) {
            this._clientColorMap.set(color, null);
        }
    }

    /**
     * Return a color not used by any client in this room
     * @returns {string}
     * @constructor
     */
    private GetUnassignedColor(): string {
        for (const color of Array.from(this._clientColorMap.keys())) {
            if (this._clientColorMap.get(color) === null) return color;
        }
        return null;
    }

    /**
     * Makes a color available again
     * @param {Client} client
     * @constructor
     */
    private ResetColor(client: Client): void {
        const color: string = this.GetClientColor(client);
        this._clientColorMap.set(color, null);
    }

    // Grid Interaction

    public createGame(sizeX: number, sizeY: number) {
        this._serverGrid = new ServerGrid(sizeX, sizeY);
    }
    /**
     * Place Clients instead of Colors as gridis not displayed anyway
     * @param {Client} client
     * @param x
     * @param y
     */
    public placeTile(client: Client, x: number, y: number): IEvent { // IPlacedTileResponse | INotYourTurnResponse
        const roomKey = this._key;
        if (this._clients[this._turnClientIndex] === client) {
            if (this._serverGrid.placeTile(client, x, y)) {
                this.setNextTurnClient();
                const clientColor = this.GetClientColor(client);
                const args = {response: "placedTile", roomKey, clientColor, x, y};
                return {name: "placedTile", args};
            } else {
                const args =  {response: "notYourTurn", roomKey};
                return {name: "notYourTurn", args}; // ToDo change to cheat Reponse
            }
        } else {
            const args =  {response: "notYourTurn", roomKey};
            return {name: "notYourTurn", args};
        }
    }

    private setNextTurnClient(): void {
        this._turnClientIndex += 1;
        if (this._turnClientIndex === this._clients.length) this._turnClientIndex = 0;
    }
}
