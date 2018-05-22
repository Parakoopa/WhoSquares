import {Game} from "./Game";

export class RequestManager {

    private _game: Game;

    constructor(game: Game){
        this._game = game;
    }

    public EventListener() {
        const socket = io();
        socket.on("connection", (resp: Response) => {
            const guid: string = resp.guid;
            const textMessage = resp.response + ":\n" + guid;
            this._game.TextElement(textMessage);
            console.log(textMessage);
        });
    }

}
