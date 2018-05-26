/**
 * Data format that gets send to client
 */
// ToDo Maybe Make Client add his secretkey to all requests
// ToDo Maybe Make Server respond to joinRoom with room secret key
// ToDo Maybe Make Client add his room secretkey to all room interactions
interface IResponse {
    response: string;
}

interface IConnectionResponse extends IResponse {
    response: "connected";
    clientKey: string;
}

interface IRoomIsFullResponse extends IResponse {
    response: "roomIsFull";
}

interface IJoinedResponse extends IResponse {
    response: "joinedRoom";
    roomKey: string;
    clientCount: number;
    color: string;
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
    clientColor: string;
    x: number;
    y: number;
}

interface INotYourTurnResponse extends IResponse {
    response: "notYourTurn";
    roomKey: string;
}
