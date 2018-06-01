/**
 * Data format that gets send to client
 */
// ToDo Maybe Make Client add his secretkey to all requests
// ToDo Maybe Make Server respond to joinRoom with room secret key
// ToDo Maybe Make Client add his room secretkey to all room interactions
interface IRequest {
    response: string;
}

interface IJoinRoomRequest extends IRequest {
    request: "joinRoom";
    clientKey: string;
    roomName: string;
}

interface ILeaveRoomRequest extends IRequest {
    request: "leaveRoom";
    clientKey: string;
    roomName: string;
}


interface IStartGameRequest extends IRequest {
    request: "startGame";
    clientKey: string;
    roomKey: string;
    sizeX: number;
    sizeY: number;
}

interface IPlaceTileRequest extends IRequest {
    request: "placeTile";
    clientKey: string;
    roomKey: string;
    x: number;
    y: number;
}
