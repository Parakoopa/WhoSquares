import {Game} from "./Game";
import Socket = SocketIOClient.Socket;

export class RequestManager {

    private _socket: Socket;
    private _game: Game;

    constructor(game: Game) {
        this._socket = io();
        this._game = game;
    }

    public EventListener() {
        // Initial Connection
        this._socket.on("connection", (resp: IConnectionResponse) => {
            const guid: string = resp.guid;
            const textMessage = resp.response + ":\n" + guid;
            this._game.TextElement(textMessage);
            console.log(textMessage);
        });
        // Join room
        this._socket.on("joinRoom", (resp: IRoomIsFullResponse | IJoinedReponse) => {
            if (resp.response === "joinedRoom") {
                const clientCount: number = resp.clientCount;
                const color: string = resp.color;
                const textMessage: string = resp.response + ": color: " + color + ", clients: " + clientCount;
                this._game.TextElement(textMessage);
                console.log(textMessage);
            } else if (resp.response === "roomIsFull") {
                const textMessage: string = resp.response;
                this._game.TextElement(textMessage);
                console.log(textMessage);
            }
        });
        //Start Game
        this._socket.on("startGame", (resp: Response) => {
          //todo  const textMessage: string = resp.response;
           // this._game.TextElement(textMessage);
            //console.log(textMessage);
        });
    }

    public JoinRoom(roomName: string): void {
        this._socket.emit("joinRoom", roomName);
    }

    public StartGame(): void {
        this._socket.emit("startGame");
    }

}
