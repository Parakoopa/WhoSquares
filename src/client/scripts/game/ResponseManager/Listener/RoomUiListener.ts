import Socket = SocketIOClient.Socket;
import {Room} from "../../Room";

// ToDo rename into messageListener or smth like that
export class RoomUiListener {

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     * @param room
     */
    public listen(socket: Socket, room: Room) {
        // Actions
        socket.on("startGame", (resp: IStartGameResponse) => {
            room.startedGame(resp.sizeX, resp.sizeY, resp.missionName);
        });
        socket.on("placedTile", (resp: IPlacedTileResponse) => {
            room.placedTile(resp.y, resp.x, resp.player);
        });
        // Actions
        socket.on("winGame", (resp: IWinGameResponse) => {
            room.updateWinner(resp.player);
        });
        socket.on("informTurn", (resp: IInformTurnResponse) => {
            room.updateTurnInfo(resp.player);
        });
        socket.on("roomMessage", (resp: IRoomMessageResponse) => {
            room.roomMessage(resp.player, resp.message);
        });
    }

}
