interface IMission {

    /**
     *
     * @returns {string}
     */
    name(): string;

    /**
     * what does the player have to do?
     * @returns {string}
     */
    description(): string;

    /**
     * Path to image of mission
     * @returns {string}
     */
    imgpath(): string;

    /**
     * Return null if condition is not met.
     * Otherwise return tiles of winning move
     * @param {IPlayer} player
     * @param {IPlayer[][]} grid
     * @returns {ITile[]}
     */
    check(player: IPlayer, grid: IPlayer[][]): ITile[];
}
