import {Client} from './Client';
import {Socket} from "socket.io";

export class ConnectionManager {

    private _io: SocketIO.Server;
    private _clients:Array<Client>;
    private _minLobbySize: number = 2;

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

            //Disconnect
            socket.on('disconnect', () => {
                this.RemoveClient(socket);
            });

            //Start Game if minimum amount of Clients are connected
            if(this._clients.length >= this._minLobbySize){
                this.EmitStartEvent();
            }
        });

    }

    /**
     * Tell all Clients to start Game
     * @constructor
     */
    private EmitStartEvent(){
        this._clients.forEach(function (client:Client) {
            client.Socket().emit('Start', "No data given");
        })
    }

    /**
     * Removes Client from List of connected clients
     * @param {SocketIO.Socket} socket
     * @constructor
     */
    private RemoveClient(socket:Socket):void{
        let client:Client = this.ClientBySocket(socket);
        let index:number = this._clients.indexOf(client);
        if (index > -1) this._clients.splice(index, 1);
    }

    /**
     * Return client of this specific socket
     * @param {SocketIO.Socket} socket
     * @returns {Client}
     * @constructor
     */
    private ClientBySocket(socket:Socket):Client{
        for (let i = 0; i < this._clients.length ; i++) {
            let client = this._clients[i];
            if(client.Socket() == socket) return client;
        }
        return null;
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