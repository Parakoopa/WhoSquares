import {Game} from "./Game";
import {RequestManager} from "./RequestManager";

export function main() {

    const game: Game = new Game(); // Phaser
    const reqManager = new RequestManager(game);
    reqManager.EventListener();
    reqManager.JoinRoom("TestRoom");

}
