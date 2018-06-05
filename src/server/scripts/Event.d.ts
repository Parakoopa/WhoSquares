/**
 * Data format that gets send to player
 */
import {Player} from "./Player";

// ToDo Maybe Make Player add his secretkey to all requests
// ToDo Maybe Make Server respond to joinRoom with room secret key
// ToDo Maybe Make Player add his room secretkey to all room interactions
interface IEvent {
    players: Player[];
    name: string;
    response: IResponse;
}
