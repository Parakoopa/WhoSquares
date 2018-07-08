export abstract class FormMission implements IMission {

    public check(player: IPlayer, grid: IPlayer[][]): ITile[] {
        const form = this.getForm();

        const gridHeight = grid.length;
        const gridWidth = grid[0].length;

        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                const current = grid[y][x];
                const winTiles: ITile[] = [];

                if (current == null)
                    continue;

                let currentFormCheck = true;
                for (const coord of form) {
                    const compareX = x + coord[0];
                    const compareY = y + coord[1];

                    // Is checking in bounds of grid
                    if (compareY >= gridHeight || compareY < 0 || compareX >= gridWidth || compareX < 0) {
                        currentFormCheck = false;
                        break;
                    }

                    const current_compare = grid[compareY][compareX];

                    // Is current player equals to checked player
                    if (!FormMission.equalsPlayer(current_compare, current)) {
                        currentFormCheck = false;
                        break;
                    }
                    winTiles.push({x: compareX, y: compareY, player});
                }
                if (currentFormCheck) {
                    return winTiles;
                }
            }
        }

        return false;
    }

    private static equalsPlayer(player1: IPlayer, player2: IPlayer) {
        if (player1 == null && player2 == null)
            return true;

        if ((player1 == null && player2 != null) || (player1 != null && player2 == null))
            return false;

        return player1.name === player2.name
            && player1.color === player2.color
            && player1.isObserver === player2.isObserver;
    }

    public abstract getForm(): number[][];
    public abstract description(): string;
    public abstract name(): string;
    public abstract imgpath(): string;
}
