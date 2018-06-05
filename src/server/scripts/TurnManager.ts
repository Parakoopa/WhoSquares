import {Player} from "./Player";

export class TurnManager {

    private _index: number = 0;
    private readonly _players: Player[];

    constructor() {
        this._players = [];
    }

    public addPlayer(player: Player): void {
        this._players.push(player);
    }

    public curPlayer(): Player {
        return this._players[this._index];
    }

    public setNextPlayer(): void {
        this._index += 1;
        if (this._index >= this._players.length) this._index = 0;
    }

    // ToDo Add removePlayer(player:Player)...

}
