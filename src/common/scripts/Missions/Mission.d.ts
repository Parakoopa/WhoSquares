interface IMission {
    name(): string;
    description(): string;
    imgpath(): string;
    check(player: IPlayer, grid: IPlayer[][]): ITile[];
}
