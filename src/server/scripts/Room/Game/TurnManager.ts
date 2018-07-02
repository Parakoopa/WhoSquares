/**
 * Stores all players of an active game in a chronological order
 */
import {Client} from "../../Client/Client";

export class TurnManager {

    private _index: number = 0;
    private _clients: Client[];

    constructor() {
        this._clients = [];
    }

    /**
     * Empty turn order and reset index
     */
    public reset(): void {
        this._index = 0;
        this._clients = [];
    }

    /**
     * add player to the end of the turn order
     * @param client
     */
    public addClient(client: Client): void {
        this._clients.push(client);
    }

    /**
     * Remove player from turn ordner
     * @param client
     */
    public removeClient(client: Client): void {
        const index: number = this._clients.indexOf(client);
        if (index < 0) return;
        this._clients.splice(index, 1);
        if (this._index >= this._clients.length) this._index = 0;
    }

    /**
     * Return player at turn
     * @returns Client
     */
    public curClient(): Client {
        return this._clients[this._index];
    }

    /**
     * Increments index or sets it to 0
     */
    public setNextClient(): void {
        this._index += 1;
        if (this._index >= this._clients.length) this._index = 0;
    }

}
