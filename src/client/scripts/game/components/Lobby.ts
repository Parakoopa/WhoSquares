import {ILobbyUI} from "../../ui/interfaces/ILobbyUI";
import {IRoomUI} from "../../ui/interfaces/IRoomUI";
import {RequestEmitter} from "../Emitter/RequestEmitter";
import {RequestManager} from "../Emitter/RequestManager";
import {LocalPlayer} from "../LocalPlayer";
import {ResponseManager} from "../ResponseManager/ResponseManager";
import {Room} from "./Room";

export class Lobby {

    private _room: Room;
    private _requestEmitter: RequestEmitter;

    constructor(private _ui: ILobbyUI) {
        this._requestEmitter = RequestManager.requestEmitter;
        ResponseManager.createLobbyListener(this);
    }

    public get room(): Room {
        return this._room;
    }

    public updateGameInfo(info: string) {
        this._ui.updateGameInfo(info);
    }

    public updateRoomList(rooms: string[]): void {
        /* Deprecated?
        let roomList = "Rooms: \n";
        for (const room of rooms) {
            roomList += room + "\n";
        }
        */
        this._ui.updateRoomList(rooms);
    }

}
