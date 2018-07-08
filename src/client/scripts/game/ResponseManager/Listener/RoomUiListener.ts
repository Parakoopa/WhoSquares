import Socket = SocketIOClient.Socket;
import {Room} from "../../components/Room";

// ToDo rename into messageListener or smth like that
export class RoomUiListener {

    constructor(socket: Socket, private _room: Room) {
        this.listen(socket);
    }

    public reListen(val: Room) {
        this._room = val;
    }

    /**
     * Listen for ErrorResponses on socket to be displayed via UiManager
     * @param {SocketIOClient.Socket} socket
     */
    public listen(socket: Socket) {
        // Room Management Actions
        socket.on("leftRoom", (resp: ILeftResponse) => {
            this._room.leftRoom();
        });
        socket.on("otherLeftRoom", (resp: IOtherLeftResponse) => {
            this._room.otherLeftRoom(resp.player,  resp.roomOwner);
        });
        socket.on("otherJoinedRoom", (resp: IOtherJoinedResponse) => {
            this._room.otherJoinedRoom(resp.otherPlayer);
        });

        // Inside Room Actions
        socket.on("startGame", (resp: IStartGameResponse) => {
            this._room.startedGame(resp.sizeX, resp.sizeY, resp.missionName);
        });
        socket.on("placedTile", (resp: IPlacedTileResponse) => {
            this._room.placedTile(resp.y, resp.x, resp.player);
        });
        socket.on("winGame", (resp: IWinGameResponse) => {
            this._room.updateWinner(resp.player, resp.missionName, resp.winTiles);
        });
        socket.on("informTurn", (resp: IInformTurnResponse) => {
            this._room.updateTurnInfo(resp.player);
        });
        socket.on("roomMessage", (resp: IRoomMessageResponse) => {
            this._room.roomMessage(resp.player, resp.message);
        });
    }

}
