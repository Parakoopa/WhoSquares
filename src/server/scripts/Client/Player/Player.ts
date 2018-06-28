/**
 * A player that represents the client in a room
 * Represented by name and color.
 * Observer flag determines whether player can interact with grid
 */
export class Player implements IPlayer {

    /**
     * @param name
     * @param color
     * @param isObserver
     */
    constructor(
        public name: string,
        public color: number = null,
        public isObserver: boolean = false
    ) {}

}
