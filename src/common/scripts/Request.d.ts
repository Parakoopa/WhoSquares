/**
 * Data format that gets send to player
 */
// ToDo Maybe Make Player add his secretkey to all requests
// ToDo Maybe Make Server respond to joinRoom with room secret key
// ToDo Maybe Make Player add his room secretkey to all room interactions
interface IRequest {
    response: string;
}

interface IJoinRoomRequest extends IRequest {
    request: "joinRoom";
    playerKey: string;
    roomName: string;
}

interface ILeaveRoomRequest extends IRequest {
    request: "leaveRoom";
    playerKey: string;
    roomKey: string;
}


interface IStartGameRequest extends IRequest {
    request: "startGame";
    playerKey: string;
    roomKey: string;
    sizeX: number;
    sizeY: number;
}

interface IPlaceTileRequest extends IRequest {
    request: "placeTile";
    playerKey: string;
    roomKey: string;
    x: number;
    y: number;
}
