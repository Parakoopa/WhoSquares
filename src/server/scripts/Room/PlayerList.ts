import {Socket} from "socket.io";
import {Player} from "./Player";

// Note: Can not extend array as very strange errors occur with Repositories
export class PlayerList {

    public _list: Player[];

    /**
     * @param {number} _maxSize
     */
    constructor(private _maxSize: number) {
        this._list = [];
    }

    /**
     * @param {Player} val
     */
    public push(val: Player): void {
        this._list.push(val);
    }

    /**
     * Transform LocalPlayers into IPlayer
     * to avoid sending secret-keys
     * @returns {IPlayer[]}
     */
    public get list(): Player[] {
        return this._list;
    }

    /**
     * @param {Player[]} val
     */
    public set list(val: Player[]) {
        this._list = val;
    }

    /**
     * @returns {Player}
     */
    public get first(): Player {
        if (this._list.length === 0) return null;
        return this._list[0];
    }

    /**
     * @returns {boolean}
     */
    public get isEmpty(): boolean {
        return this._list.length === 0 || !this._list.find((p) => !p.isObserver);
    }

    /**
     * @param {Player} val
     */
    public remove(val: Player): void {
        const index = this._list.indexOf(val);
        if (index > -1)this._list.splice(index, 1);
    }

    /**
     * Return all list of a room except the given one
     * @param {Player} player
     * @returns {Player[]}
     */
    public getPlayersExcept(player: IPlayer): Player[] {
        const players: Player[] = [];
        for (const needle of  this._list) {
            if (needle !== player) {
                players.push(needle);
            }
        }
        return players;
    }

    /**
     * Maximum amount of list allowed in room
     * @returns {number}
     */
    public get maxSize(): number {
        return this._maxSize;
    }

    /**
     * Returns all sockets for list except the given one
     * @param {Socket} socket
     * @returns {Socket[]}
     */
    public getPlayerSocketsExcept(socket: Socket): Socket[] {
        const sockets: Socket[] = [];
        for (const curPlayer of this._list) {
            if (socket !== curPlayer.socket) sockets.push(curPlayer.socket);
        }
        return sockets;
    }

    /**
     * @param {string} key
     * @returns {Player}
     */
    public getPlayerByPlayerKey(key: string): Player {
        for (const player of this._list) {
            if (key === player.user.key) return player;
        }
        return null;
    }

    /**
     * @param {SocketIO.Socket} socket
     * @returns {Player}
     */
    public getPlayerForSocket(socket: Socket): Player {
        for (const player of this._list) {
            if (player.socket && socket.client.id === player.socket.client.id) {
                // TODO: Nasty bug! Sometimes the socket object changes but no actual disconnection happens?
                // This can lead to more issues, hopefully this fixes most of them.
                if (socket !== player.socket) {
                    // Update new socket reference.
                    player.socket = socket;
                }
                return player;
            }
        }
        return null;
    }

    /**
     * Count of all clients in room (list + observers)
     * @returns {number}
     */
    public size(): number {
        return this._list.length;
    }

    /**
     * @returns {SocketIO.Socket[]}
     */
    public getAllSockets() {
        return this._list.map((pl) => pl.socket);
    }

}
