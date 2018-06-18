interface IPlayer {
    name: string;
    color: number;
    isObserver: boolean;
}

interface ILocalPlayer extends IPlayer {
    key: string;
}
