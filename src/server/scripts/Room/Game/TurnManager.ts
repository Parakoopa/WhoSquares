import {LocalPlayer} from "../../Client/Player/LocalPlayer";

/**
 * Stores all players of an active game in a chronological order
 */
export class TurnManager {

    private _index: number = 0;
    private _players: LocalPlayer[];

    constructor() {
        this._players = [];
    }

    /**
     * Empty turn ordner and reset index
     */
    public reset(): void {
        this._index = 0;
        this._players = [];
    }

    /**
     * add player to the end of the turn order
     * @param {LocalPlayer} player
     */
    public addClient(player: LocalPlayer): void {
        this._players.push(player);
    }

    /**
     * Remove player from turn ordner
     * @param {LocalPlayer} player
     */
    public removeClient(player: LocalPlayer): void {
        const index: number = this._players.indexOf(player);
        if (index < 0) return;
        this._players.splice(index, 1);
        if (this._index >= this._players.length) this._index = 0;
    }

    /**
     * Return player at turn
     * @returns {LocalPlayer}
     */
    public curClient(): LocalPlayer {
        return this._players[this._index];
    }

    /**
     * Increments index or sets it to 0
     */
    public setNextClient(): void {
        this._index += 1;
        if (this._index >= this._players.length) this._index = 0;
    }

}
