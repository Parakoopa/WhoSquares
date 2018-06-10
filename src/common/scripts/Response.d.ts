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

interface IRoomIsFullResponse extends IResponse {
    response: "roomIsFull";
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
    otherPlayer: IPlayer;
}

interface ILeftResponse extends IResponse {
    response: "leftRoom";
    roomKey: string;
}

interface IOtherLeftResponse extends IResponse {
    response: "otherLeftRoom";
    roomKey: string;
    name: string;
}

interface IRoomIsFullResponse extends IResponse {
    response: "roomIsFull";
}

interface IStartGameResponse extends IResponse {
    response: "startGame";
    sizeX: number;
    sizeY: number;
}

interface INotOwnerResponse extends IResponse {
    response: "notOwner";
}

interface IPlacedTileResponse extends IResponse {
    response: "placedTile";
    roomKey: string;
    player: IPlayer;
    x: number;
    y: number;
}

interface INotYourTurnResponse extends IResponse {
    response: "notYourTurn";
    roomKey: string;
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
    roomKey: string;
    player: IPlayer;
}

