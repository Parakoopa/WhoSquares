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
    playerKey: string;
    roomName: string;
}

interface ILeaveRoomRequest extends IRequest {
    playerKey: string;
    roomKey: string;
}

interface IStartGameRequest extends IRequest {
    playerKey: string;
    roomKey: string;
    sizeX: number;
    sizeY: number;
}

interface IPlaceTileRequest extends IRequest {
    playerKey: string;
    roomKey: string;
    y: number;
    x: number;
}

interface IRoomMessageRequest extends IRequest {
    playerKey: string;
    roomKey: string;
    message: string;
}

interface IRegisterRequest extends IRequest {
    name: string;
}