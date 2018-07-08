/**
 * Data format that gets send to player
 */

interface IResponse {}

interface IRegisteredResponse extends IResponse {
    key: string;
}

interface IJoinedResponse extends IResponse {
    roomKey: string;
    roomName: string;
    color: number;
    roomOwner: IPlayer;
    otherPlayers: IPlayer[];
    gridInfo: IPlayer[][];
}

interface IOtherJoinedResponse extends IResponse {
    roomName: string;
    otherPlayer: IPlayer;
}

interface ILeftResponse extends IResponse {
    roomName: string;
}

interface IOtherLeftResponse extends IResponse {
    roomName: string;
    player: IPlayer;
    roomOwner: IPlayer;
}

interface IStartGameResponse extends IResponse {
    roomName: string;
    sizeX: number;
    sizeY: number;
    missionName: string;
}

interface IPlacedTileResponse extends IResponse {
    roomName: string;
    player: IPlayer;
    x: number;
    y: number;
}

interface IInformTurnResponse extends IResponse {
    roomName: string;
    player: IPlayer;
}

interface IWinGameResponse extends IResponse {
    roomName: string;
    player: IPlayer;
    missionName: string;
    winTiles: ITile[];
}

interface IRoomMessageResponse extends IResponse {
    roomName: string;
    player: IPlayer;
    message: string;
}

interface IRoomIsFullResponse extends IResponse {
    roomName: string;
}

interface IInvalidPlacement extends IResponse {
    roomName: string;
}

interface IGameAlreadyEnded extends IResponse {
    roomName: string;
}

interface INotYourTurnResponse extends IResponse {
    roomName: string;
}

interface INotOwnerResponse extends IResponse {
    roomName: string;
}

interface IObserverResponse extends IResponse {
}

interface INotInRoomResponse extends IResponse {
}

interface IRefreshResponse extends IResponse {
}

interface IRoomListResponse extends IResponse {
    rooms: Array<{
        name: string;
        key: string;
        ended: boolean;
    }>;
}

interface IRoomStatsResponse extends IResponse {
    roomKey: string;
    roomName: string;
    gridSize: {
        x: number;
        y: number;
    };
    players: {
        base: IPlayer;
        missionName: string;
        coverage: number; // 0 - 1
        tilesPlaced: number;
        owner: boolean;
    };
    general: {
        coverage: number; // 0 - 1
        tilesPlaced: number;
        numberTurns: number;
    };
    replay: IReplayLogEntry[];
}

interface IUserStatsResponse extends IResponse {
    userName: string;
    tilesPlaced: number;
    gamesPlayed: {
        total: number;
        won: number;
    };
}

interface IGlobalStatsResponse extends IResponse {
    tilesPlaced: number;
    gamesPlayed: number;
}
