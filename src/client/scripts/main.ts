import {Game} from "./Game";
import {RequestManager} from "./RequestManager";

export function main() {

    const game: Game = new Game(); // Phaser
    const reqManager = new RequestManager(game);
    game.reqManager(reqManager);
    reqManager.EventListener();
    reqManager.JoinRoom("TestRoom");

}
