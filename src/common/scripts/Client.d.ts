interface IClient {

    getKey(): string;
    getName(): string;
    setName(val: string): void;
    getRoom(): IRoom;
    setRoom(val: IRoom): void;
    getColor(): string;
    setColor(val: string): void;
    getMission(): IMission;
    setMission(val: IMission): void;
}
