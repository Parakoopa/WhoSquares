interface IMission {

    name(): string;
    description(): string;
    check(player: IPlayer, grid: IPlayer[][]): boolean;
}
