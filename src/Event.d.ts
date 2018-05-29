/**
 * Data format that gets send to client
 */
import {Client} from "./server/scripts/Client";

// ToDo Maybe Make Client add his secretkey to all requests
// ToDo Maybe Make Server respond to joinRoom with room secret key
// ToDo Maybe Make Client add his room secretkey to all room interactions
interface IEvent {
    clients: Client[];
    name: string;
    response: IResponse;
}