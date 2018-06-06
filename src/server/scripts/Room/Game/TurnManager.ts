import {Client} from "../../Client/Client";

export class TurnManager {

    private _index: number = 0;
    private readonly _clients: Client[];

    constructor() {
        this._clients = [];
    }

    public addClient(client: Client): void {
        this._clients.push(client);
    }

    public curClient(): Client {
        return this._clients[this._index];
    }

    public setNextClient(): void {
        this._index += 1;
        if (this._index >= this._clients.length) this._index = 0;
    }

    // ToDo Add removeClient(client:Client)...

}
