/**
 * Data format that gets send to client
 */
interface Response {
    response: string;
    guid?: string;
    clientCount?: number;
    color?: string;
    values: {};

}
