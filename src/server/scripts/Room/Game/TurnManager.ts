import {LocalPlayer} from "../../Client/LocalPlayer";

export class TurnManager {

    private _index: number = 0;
    private _players: LocalPlayer[];

    constructor() {
        this._players = [];
    }

    public reset(): void {
        this._index = 0;
        this._players = [];
    }

    public addClient(player: LocalPlayer): void {
        this._players.push(player);
    }

    public removeClient(player: LocalPlayer): void {
        const index: number = this._players.indexOf(player);
        if (index < 0) return;
        this._players.splice(index, 1);
        if (this._index >= this._players.length) this._index = 0;
    }

    public curClient(): LocalPlayer {
        return this._players[this._index];
    }

    public setNextClient(): void {
        this._index += 1;
        if (this._index >= this._players.length) this._index = 0;
    }

    // ToDo Add removeClient(client:Client)...

}
