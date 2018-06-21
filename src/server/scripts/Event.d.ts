/**
 * Data format that gets send to client
 */
import {Client} from "./Client/Client";

interface IEvent {
    clients: Client[];
    name: string;
    response: IResponse;
}
