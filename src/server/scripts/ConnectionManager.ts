import {Socket} from "socket.io";
import {Player} from "./Player";
import {IEvent} from "./Event";
import {Lobby} from "./Lobby";
import {Utility} from "./Utility";

export class ConnectionManager {

    private _io: SocketIO.Server;
    private readonly _players: Player[];
    private _lobby: Lobby;
    private connectionCounter: number = 100;

    constructor( io: SocketIO.Server ) {
        this._lobby = new Lobby();
        this._players = [];
        this._io = io;
    }

    /**
     * Add all Listening Events here
     * @constructor
     */
    public EventListener() {
        this._io.on("connection", (socket: Socket) => {
            const connectionEvent: IEvent = this.addPlayer(new Player(socket, Utility.getGUID(), "" + this.connectionCounter++));
            this.emitEvent(connectionEvent);

            // Disconnect
            socket.on("disconnect", () => {
                this.removePlayer(socket);
            });

            // Player requests to join specific room
            socket.on("joinRoom", (req: IJoinRoomRequest) => {
                const joinEvents: IEvent[] = this._lobby.joinRoom(this.playerBySocket(socket), req);
                this.emitEvents(joinEvents);
            });

            // Player requests to join specific room
            socket.on("leaveRoom", (req: ILeaveRoomRequest) => {
                const leftEvents: IEvent[] = this._lobby.leaveRoom(this.playerBySocket(socket), req);
                this.emitEvents(leftEvents);
            });

            // Start Game, create Grid, inform Players
            socket.on("startGame", (req: IStartGameRequest) => {
                const player: Player = this.playerBySocket(socket);
                const startEvents: IEvent[] = this._lobby.startGame(player, req.sizeX, req.sizeY);
                this.emitEvents(startEvents);
            });

            // A player colors a certain tile
            socket.on("placeTile", (req: IPlaceTileRequest) => {
                const player: Player = this.playerBySocket(socket);
                const placeEvents: IEvent[] =  player.room.placeTile(player, req.x, req.y);
                this.emitEvents(placeEvents);
            });

        });

    }

    /**
     * Emits a Response to all players listed in IEvent
     * @param {IEvent} event
     */
    private emitEvent(event: IEvent): void {
        console.log("Emitted to Players: " + event.name + " to: " + event.players);
        for (let i = 0; i < event.players.length; i++) {
            event.players[i].socket.emit(event.name, event.response);
        }
    }

    /**
     * Emits Multiple Events made of Responses to multiple Players
     * @param {IEvent[]} events
     */
    private emitEvents(events: IEvent[]): void {
        for (let i = 0; i < events.length; i++) {
            this.emitEvent(events[i]);
        }
    }

    /**
     * Save
     * @param {Player} player
     * @returns {IEvent}
     */
    private addPlayer(player: Player): IEvent {
        this._players.push(player);
        const response =  {response: "connected", playerKey: player.key} as IConnectedResponse;
        return {players: [player], name: "connected", response};
    }

    /**
     * Removes Player from List of connected players
     * @param {SocketIO.Socket} socket
     * @constructor
     */
    private removePlayer(socket: Socket): void {
        const player: Player = this.playerBySocket(socket);
        const index: number = this._players.indexOf(player);
        if (index > -1) this._players.splice(index, 1);
    }

    /**
     * Return player of this specific socket
     * @param {SocketIO.Socket} socket
     * @returns {Player}
     * @constructor
     */
    private playerBySocket(socket: Socket): Player {
        for (const player of this._players) {
            if (player.socket === socket) return player;
        }
        return null;
    }

    /**
     * Return Player based on key
     * @param {string} key
     * @returns {Player}
     * @constructor
     */
    private playerByKey(key: string): Player {
        for (const player of this._players) {
            if (player.key === key) return player;
        }
        return null;
    }

}
