import {GameManager} from "./GameManager";
import {RequestManager} from "./RequestManager";

export function main() {

    const game: GameManager = new GameManager(); // Phaser
    const reqManager = new RequestManager(game);
    game.reqManager(reqManager);
    reqManager.eventListener();
    reqManager.joinRoom("TestRoom");

}
