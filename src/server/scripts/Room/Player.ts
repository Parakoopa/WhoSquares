/**
 * A player that represents the client in a room
 * Represented by name and color.
 * Observer flag determines whether player can interact with grid
 */
import {Socket} from "socket.io";
import {User} from "../User/User";

export class Player implements IPlayer {
    public mission: IMission;
    public name: string;

    /**
     * @param user
     * @param socket
     * @param color
     * @param isObserver
     */
    constructor(
        public user: User,
        public socket: Socket,
        public color: number,
        public isObserver: boolean = false
    ) {
        this.name = user.name;
    }

}
