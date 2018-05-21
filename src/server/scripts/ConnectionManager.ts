import Socket = NodeJS.Socket;
import {Client} from './Client';

export class ConnectionManager {

    private _io: SocketIO.Server;
    private _clients:Array<Client>;

    constructor( io: SocketIO.Server ){
        this._clients = [];
        this._io = io;
    }

    /**
     * Add all Listening Events here
     * @constructor
     */
    EventListener(){
        this._io.on('connection', (socket: Socket) => {
            let client:Client = new Client(socket, this.GetGUID());
            this._clients.push(client);
            socket.emit('HelloWorld', "Welcome! GUID:\n" + client.Guid());
        });
    }

    /**
     * Generate Unique Identifier
     * @returns {string}
     * @constructor
     */
    private GetGUID() {
        //src: https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

}