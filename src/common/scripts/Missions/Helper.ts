export class Helper {

    /**
     *
     * @param {IPlayer} player1
     * @param {IPlayer} player2
     * @returns {boolean}
     */
    public static equalsPlayer(player1: IPlayer, player2: IPlayer) {
        if (player1 == null && player2 == null)
            return true;

        if ((player1 == null && player2 != null) || (player1 != null && player2 == null))
            return false;

        return player1.name === player2.name
            && player1.color === player2.color
            && player1.isObserver === player2.isObserver;
    }
}
