// Bitte aufgeräumt halten
// Sämtliche Funktionalitäten in Scripte/Klassen auslagern

    import {Game} from "./Game";
    import {RequestManager} from "./RequestManager";
    import {bla} from "./test";

    export function main() {

    const game: Game = new Game(); // Phaser
    const reqManager = new RequestManager(game);
    game.reqManager(reqManager);
    reqManager.EventListener();
   // bla();
    reqManager.JoinRoom("TestRoom");

}
