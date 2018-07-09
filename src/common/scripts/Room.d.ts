interface IRoom {
    key: string;
    name: string;
}

interface IRoomStats {
    players: IRoomStatsPlayer[];
    general: {
        coverage: number; // 0 - 1
        tilesPlaced: number;
        numberTurns: number;
    };
}

interface IRoomStatsPlayer {
    base: IPlayer;
    missionName: string;
    coverage: number; // 0 - 1
    tilesPlaced: number;
    owner: boolean;
    winner: boolean;
}
