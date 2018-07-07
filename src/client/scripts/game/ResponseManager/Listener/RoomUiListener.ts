import Socket = SocketIOClient.Socket;
import {Room} from "../../components/Room";

// ToDo rename into messageListener or smth like that
export class RoomUiListener {

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     * @param room
     */
    public listen(socket: Socket, room: Room) {
        // Room Management Actions
        socket.on("joinedRoom", (resp: IJoinedResponse) => {
            room.joinedRoom(resp);
        });
        socket.on("leftRoom", (resp: ILeftResponse) => {
            room.leftRoom();
        });
        socket.on("otherLeftRoom", (resp: IOtherLeftResponse) => {
            room.otherLeftRoom(resp.player);
        });
        socket.on("otherJoinedRoom", (resp: IOtherJoinedResponse) => {
            room.otherJoinedRoom(resp.otherPlayer);
        });

        // Inside Room Actions
        socket.on("startGame", (resp: IStartGameResponse) => {
            room.startedGame(resp.sizeX, resp.sizeY, resp.missionName);
        });
        socket.on("placedTile", (resp: IPlacedTileResponse) => {
            room.placedTile(resp.y, resp.x, resp.player);
        });
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
