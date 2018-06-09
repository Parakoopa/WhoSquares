
export class Player implements IPlayer {

    /**
     * @param name
     * @param color
     */
    constructor(
        public name: string,
        public color: number = null
    ) {}

}
