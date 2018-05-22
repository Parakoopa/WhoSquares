/**
 * Data format that gets send to client
 */
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
