import Socket = SocketIOClient.Socket;
import {GameManager} from "../../GameManager";

export class EventListener {

    /**
     * Listen to event Responses om socket and execute them via gameManager
     * (Responses are listed in /common directory)
     * @param {SocketIOClient.Socket} socket
     * @param {GameManager} gameMan
     */
    public static listen(socket: Socket, gameMan: GameManager) {
        // Initial Connection
        socket.on("connected", (resp: IConnectedResponse) => {
            console.log("connected and got key:" + resp.key);
            localStorage["who-squares-private-key"] = resp.key; // only strings
            gameMan.addLocalPlayer(resp.player, resp.key);
        });

        // Actions
        socket.on("joinedRoom", (resp: IJoinedResponse) => {
            gameMan.joinedRoom(resp);
        });
        socket.on("leftRoom", (resp: ILeftResponse) => {
            gameMan.leftRoom();
        });
        socket.on("otherLeftRoom", (resp: IOtherLeftResponse) => {
            gameMan.otherLeftRoom(resp.player);
        });
        socket.on("otherJoinedRoom", (resp: IOtherJoinedResponse) => {
            gameMan.otherJoinedRoom(resp.otherPlayer);
        });
        socket.on("placedTile", (resp: IPlacedTileResponse) => {
            gameMan.placedTile(resp.y, resp.x, resp.player);
        });
        socket.on("startGame", (resp: IStartGameResponse) => {
            gameMan.startedGame(resp.sizeX, resp.sizeY);
        });
        socket.on("winGame", (resp: IWinGameResponse) => {
            gameMan.winGame(resp.player);
        });
        socket.on("informTurn", (resp: IInformTurnResponse) => {
            gameMan.turnInfo(resp.player);
        });
    }
}
