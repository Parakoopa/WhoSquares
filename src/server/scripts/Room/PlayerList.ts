import {Socket} from "socket.io";
import {Player} from "./Player";

export class PlayerList {

    public _players: Player[];

    constructor(private _maxSize: number) {
        this._players = [];
    }

    public push(val: Player): void {
        this._players.push(val);
    }

    /**
     * Transform LocalPlayers into IPlayer
     * to avoid sending secret-keys
     * @returns {IPlayer[]}
     */
    public get players(): Player[] {
        return this._players;
    }

    public set players(val: Player[]) {
        this._players = val;
    }

    public get first(): Player {
        if (this._players.length === 0) return null;
        return this._players[0];
    }

    public get isEmpty(): boolean {
        return this._players.length === 0 || !this._players.find((p) => !p.isObserver);
    }

    public remove(val: Player): void {
        const index = this._players.indexOf(val);
        if (index > -1)this._players.splice(index, 1);
    }

    /**
     * Return all players of a room except the given one
     * @param {Player} player
     * @returns {Player[]}
     */
    public getPlayersExcept(player: IPlayer): Player[] {
        const players: Player[] = [];
        for (const needle of  this._players) {
            if (needle !== player) {
                players.push(needle);
            }
        }
        return players;
    }

    /**
     * Maximum amount of players allowed in room
     * @returns {number}
     */
    public get maxSize(): number {
        return this._maxSize;
    }

    /**
     * Returns all sockets for players except the given one
     * @param {Socket} socket
     * @returns {Socket[]}
     */
    public getPlayerSocketsExcept(socket: Socket): Socket[] {
        const sockets: Socket[] = [];
        for (const curPlayer of this._players) {
            if (socket !== curPlayer.socket) sockets.push(curPlayer.socket);
        }
        return sockets;
    }

    public getPlayerByPlayerKey(key: string): Player {
        for (const player of this._players) {
            if (key === player.user.key) return player;
        }
        return null;
    }

    public getPlayerForSocket(socket: Socket): Player {
        for (const player of this._players) {
            if (socket.client.id === player.socket.client.id) {
                // TODO: Nasty bug! Sometimes the socket object changes but no actual disconnection happens?
                // This can lead to more issues, hopefully this fixes most of them.
                if (socket !== player.socket) {
                    // Update new socket reference.
                    player.socket = socket;
                }
                return player;
            }
        }
    }

    /**
     * Count of all clients in room (players + observers)
     * @returns {number}
     */
    public size(): number {
        return this._players.length;
    }

    public getAllSockets() {
        return this._players.map((pl) => pl.socket);
    }

}
