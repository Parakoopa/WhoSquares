/**
 * Data format that gets send to client
 */
import {Socket} from "socket.io";

interface IEvent {
    clients: Socket[];
    name: string;
    response: IResponse;
}
