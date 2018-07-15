/**
 * Stores all list of an active game in a chronological order
 */
import {Player} from "../Player";

export class TurnManager {

    private _index: number = 0;
    private _players: Player[];

    constructor() {
        this._players = [];
    }

    /**
     * Empty turn order and reset index
     */
    public reset(): void {
        this._index = 0;
        this._players = [];
    }

    /**
     * add player to the end of the turn order
     * @param client
     */
    public addPlayer(client: Player): void {
        this._players.push(client);
    }

    /**
     * Remove player from turn ordner
     * @param client
     */
    public removePlayer(client: Player): void {
        const index: number = this._players.indexOf(client);
        if (index < 0) return;
        this._players.splice(index, 1);
        if (this._index >= this._players.length) this._index = 0;
    }

    /**
     * Return player at turn
     * @returns Player
     */
    public curPlayer(): Player {
        return this._players[this._index];
    }

    /**
     * Return player at turn (index)
     * @returns number
     */
    public curIndex(): number {
        return this._index;
    }

    /**
     * Increments index or sets it to 0
     */
    public setNextPlayer(): void {
        this._index += 1;
        if (this._index >= this._players.length) this._index = 0;
    }

    /**
     * Manually set the current player index
     */
    public setCurIndex(index: number) {
        this._index = index;
    }
}
