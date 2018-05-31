interface IMission {

    name(): string;
    description(): string;
    check(client: IClient, grid: IClient[][]): boolean;
}
