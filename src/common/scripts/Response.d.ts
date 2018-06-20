/**
 * Data format that gets send to player
 */
// ToDo Maybe Make Player add his secretkey to all requests
// ToDo Maybe Make Server respond to joinRoom with room secret key
// ToDo Maybe Make Player add his room secretkey to all room interactions
interface IResponse {
    response: string;
}

interface IConnectedResponse extends IResponse {
    response: "connected";
    player: IPlayer;
    key: string;
}

interface IRefreshResponse extends IResponse {
    response: "refresh";
}

interface IRoomIsFullResponse extends IResponse {
    response: "roomIsFull";
    roomName: string;
}

interface IJoinedResponse extends IResponse {
    response: "joinedRoom";
    roomKey: string;
    roomName: string;
    color: number;
    otherPlayers: IPlayer[];
    gridInfo: IPlayer[][];
}

interface IOtherJoinedResponse extends IResponse {
    response: "otherJoinedRoom";
    roomName: string;
    otherPlayer: IPlayer;
}

interface ILeftResponse extends IResponse {
    response: "leftRoom";
    roomName: string;
}

interface IOtherLeftResponse extends IResponse {
    response: "otherLeftRoom";
    roomName: string;
    player: IPlayer;
}

interface IRoomIsFullResponse extends IResponse {
    response: "roomIsFull";
    roomName: string;
}

interface IStartGameResponse extends IResponse {
    response: "startGame";
    roomName: string;
    sizeX: number;
    sizeY: number;
}

interface INotOwnerResponse extends IResponse {
    response: "notOwner";
    roomName: string;
}

interface INotInRoomResponse extends IResponse {
    response: "notInRoom";
}

interface IPlacedTileResponse extends IResponse {
    response: "placedTile";
    roomName: string;
    player: IPlayer;
    x: number;
    y: number;
}

interface INotYourTurnResponse extends IResponse {
    response: "notYourTurn";
    roomName: string;
}

interface IAlreadyInRoomResponse extends IResponse {
    response: "alreadyInRoom";
}

interface IObserverResponse extends IResponse {
    response: "observer";
}

interface IInformTurnResponse extends IResponse {
    response: "informTurn";
    player: IPlayer;
}

interface IWinGameResponse extends IResponse {
    response: "winGame";
    roomName: string;
    player: IPlayer;
}

interface IInvalidPlacement extends IResponse {
    response: "invalidPlacement";
    roomName: string;
}
