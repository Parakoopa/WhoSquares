interface IRoom {

    getKey(): string;
    getName(): string;
    getClients(): IClient[];
}
