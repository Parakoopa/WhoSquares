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
    guid: string;
}

interface IRoomIsFullResponse extends IResponse {
    response: "roomIsFull";
}

interface IJoinedReponse extends IResponse {
    response: "joinedRoom";
    clientCount: number;
    color: string;
}
