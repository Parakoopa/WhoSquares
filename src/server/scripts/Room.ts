import {Client} from "./Client";

/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
 */
export class Room {

    private readonly _name: string;
    private readonly _size: number;
    private _clients: Client[];
    private _clientColorMap: Map<string, Client>;
    private readonly _colors: string[] =
        ["red", "green", "blue", "yellow", "orange", "purple", "pink", "grey", "black", "white"];

    constructor(name: string, size: number) {
        this._clients = [];
        this._name = name;
        this._size = size;
        this._clientColorMap = new Map();
        this.SetColors();
    }

    public Name(): string {
        return this._name;
    }

    public Size(): number {
        return this._size;
    }

    /**
     * Add Client & assign/return its color
     * @param {Client} client
     * @returns {string}
     * @constructor
     */
    public AddClient(client: Client): string {
        this._clients.push(client);
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
        for (const key of Array.from(this._clientColorMap.keys())) {
            if (this._clientColorMap.get(key) === null) return key;
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

}
