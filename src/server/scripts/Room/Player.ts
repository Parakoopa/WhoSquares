/**
 * A player that represents the client in a room
 * Represented by name and color.
 * Observer flag determines whether player can interact with grid
 */
import {Socket} from "socket.io";

export class Player implements IPlayer {
    public mission: IMission;

    /**
     * @param name
     * @param key
     * @param socket
     * @param color
     * @param isObserver
     */
    constructor(
        public name: string,
        public key: string,
        public socket: Socket,
        public color: number,
        public isObserver: boolean = false
    ) {}

}
