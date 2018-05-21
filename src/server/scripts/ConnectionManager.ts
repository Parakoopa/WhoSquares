import {Client} from './Client';
import {Socket} from 'socket.io';
import {Room} from './Room';

export class ConnectionManager {

    private _io: SocketIO.Server;
    private readonly _clients:Array<Client>;
    private _minimumClientsPerGame: number = 2;
    private readonly _rooms:Array<Room>;
    private _maxRoomClients: number = 10;

    constructor( io: SocketIO.Server ){
        this._clients = [];
        this._rooms = [];
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
            //Client requests to join specific room
            socket.on('joinRoom', (data) =>{ //ToDo Find out which type data has
                let resp:Response = this.JoinRoom(this.ClientBySocket(socket), data);
                socket.emit('joinRoom', resp);
            });

            //Start Game if minimum amount of Clients are connected
            if(this._clients.length >= this._minimumClientsPerGame){
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
     * Create Room if necessary
     * Return responses: RoomIsFull or JoinedRoom + clientCount
     * @param {Client} client
     * @param {string} roomName
     * @returns {string}
     * @constructor
     */
    private JoinRoom(client:Client, roomName:string):Response{
        let room:Room = this.RoomByName(roomName);
        if(room == null)room = this.CreateRoom();
        else if(room.GetClients.length > this._maxRoomClients){
            return {
                response: "RoomIsFull",
                values: {}
            };
        }

        if(!room.ContainsClient(client)){
            let color:string = room.AddClient(client);
            return {
                response: "JoinedRoom",
                values: {"clientCount": room.GetClients.length,
                         "color":color
                }
            };
        }
    }

    /**
     * Create room with unique id
     * @returns {Room}
     * @constructor
     */
    private CreateRoom():Room{
        let room:Room = new Room(this.GetGUID().toString());
        this._rooms.push(room);
        return room;
    }

    /**
     * Return room based on its unique id (name)
     * @param {string} roomName
     * @returns {Room}
     * @constructor
     */
    private RoomByName(roomName:string):Room{
        for (let i = 0; i < this._rooms.length ; i++) {
            let room = this._rooms[i];
            if(room.Name() == roomName) return room;
        }
        return null;
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