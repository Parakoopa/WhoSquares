
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
