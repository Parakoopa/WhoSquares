import Socket = SocketIOClient.Socket;
import {Client} from "./Client";
import {GameManager} from "./GameManager";

export class RequestManager {

    private _socket: Socket;
    private _gameMan: GameManager;
    private _clientKey: string;
    private _roomName: string;
    private _roomKey: string;
    private _otherClients: Client[];

    constructor(game: GameManager) {
        this._socket = io();
        this._gameMan = game;
    }

    public eventListener() {
        // Initial Connection
        this._socket.on("connected", (resp: IConnectedResponse) => {
            this._clientKey = resp.clientKey;
            this._gameMan.textElement(resp.response + ":\n" +  resp.clientKey);
        });
        // Join room
        this._socket.on("joinedRoom", (resp: IRoomIsFullResponse | IJoinedResponse) => {
            this.joinedRoom(resp);
        });
        this._socket.on("leftRoom", (resp: ILeftResponse) => {
            this.leftRoom(resp);
        });
        this._socket.on("otherLeftRoom", (resp: IOtherLeftResponse) => {
            console.log("workssss");
            this.otherLeftRoom(resp);
        });
        this._socket.on("otherJoinedRoom", (resp: IOtherJoinedResponse) => {
            this.otherJoinedRoom(resp);
        });
        // placedtile
        this._socket.on("placedTile", (resp: IPlacedTileResponse) => {
            this.placedTile(resp);
        });
        this._socket.on("notYourTurn", (resp: INotYourTurnResponse) => {
            this._gameMan.textElement(resp.response);
        });
        // Start GameManager
        this._socket.on("startGame", (resp: IStartGameResponse) => {
            this.startedGame(resp);
        });

        this._socket.on("informTurn", (resp: IInformTurnResponse) => {
            const color: number = parseInt(resp.turnColor, 16);
            this._gameMan.turnInfo(color);
        });
        this._socket.on("winGame", (resp: IWinGameResponse) => {
            this._gameMan.winGame(resp.clientColor);
        });
    }

    public joinRoom(roomName: string): void {
        const clientKey = this._clientKey;
        this._socket.emit("joinRoom", {request: "joinRoom", clientKey, roomName});
    }

    public leaveRoom(): void {
        const clientKey = this._clientKey;
        const roomKey = this._roomKey;
        this._socket.emit("leaveRoom", {request: "leaveRoom", clientKey, roomKey});
    }

    public startGame(sizeX: number, sizeY: number): void {
        const clientKey = this._roomKey;
        const roomKey = this._roomKey;
        this._socket.emit("startGame", {request: "startGame", clientKey, roomKey, sizeX, sizeY});
    }

    public placeTile(x: number, y: number): void {
        const clientKey = this._clientKey;
        const roomKey = this._roomKey;
        this._socket.emit("placeTile" , {request: "placeTile", clientKey, roomKey, x, y});
    }

    /**
     *
     * @param {IRoomIsFullResponse | IJoinedResponse} resp
     */
    private joinedRoom(resp: IRoomIsFullResponse | IJoinedResponse): void {
        if (resp.response === "joinedRoom") {
            this._roomName = resp.roomName;
            this._roomKey = resp.roomKey;
            this._gameMan.color(parseInt(resp.color, 16));
            this._gameMan.textElement("you joined as: " + resp.color + " in:" + resp.roomKey);
            this._gameMan.roomName(resp.roomName);
            this.addClients(resp.otherClients);
        } else if (resp.response === "roomIsFull") {
            this._gameMan.textElement(resp.response);
        }
    }

    private leftRoom(resp: ILeftResponse): void {
            this._roomName = null;
            this._roomKey = null;
            // ToDo reset color: this._gameMan.color(parseInt(resp.color, 16));
            this._gameMan.textElement("left room");
            this._gameMan.roomName("left room");
            this._gameMan.destroyGrid();
            this.resetClients();
    }

    private otherLeftRoom(resp: IOtherLeftResponse): void {
        const client: Client = this.clientByName(resp.name);
        console.log(client);
        this.removeClient(client);
    }

    private otherJoinedRoom(resp: IOtherJoinedResponse): void {
        const client: Client = new Client(resp.otherClient._name, resp.otherClient._color);
        this.addClient(client);
    }

    private clientByName(clientName: string): Client {
        console.log(this._otherClients.length);
        for (const client of this._otherClients) {
            console.log(client.getName() + "   " + clientName);
            if (client.getName() === clientName) return client;
        }
        return null;
    }
    private addClients(clients: IClient[]): void {
        this._otherClients = []; // Reset on Join Room
        for (const client of clients) {
            console.log("add Client: " + client._name);
            this._otherClients.push(new Client(client._name, client._color));
        }
        this.updateRoomList();
    }

    private addClient(client: Client): void {
        this._otherClients.push(new Client(client._name, client._color));
        this.updateRoomList();
    }

    private removeClient(client: Client): void {
        const index: number = this._otherClients.indexOf(client);
        if (index > -1) this._otherClients.splice(index, 1);
        this.updateRoomList();
    }

    private resetClients(): void {
        this._otherClients = [];
        this.updateRoomList();
    }

    private updateRoomList(): void {
        let roomList: string = "";
        for (const client of this._otherClients) {
            roomList += client.getName() + "\n";
        }
        this._gameMan.roomList(roomList);

    }

    private placedTile(resp: IPlacedTileResponse): void {
        const color: number = parseInt(resp.clientColor, 16);
        this._gameMan.placedTile(color, resp.x, resp.y);
        this._gameMan.textElement(resp.response);
    }

    private startedGame(resp: IStartGameResponse) {
        this._gameMan.createGrid(resp.sizeX, resp.sizeY);
        const textMessage: string = resp.response;
        this._gameMan.textElement(textMessage);
    }
}
