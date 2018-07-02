/**
 * Data format that gets send to player
 */

interface IResponse {}

interface IConnectedResponse extends IResponse {
    player: IPlayer;
    key: string;
}

interface IJoinedResponse extends IResponse {
    roomKey: string;
    roomName: string;
    color: number;
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
}

interface IStartGameResponse extends IResponse {
    roomName: string;
    sizeX: number;
    sizeY: number;
    mission: IMission;
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

interface IAlreadyInRoomResponse extends IResponse {
}
