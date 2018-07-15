import {ILobbyUI} from "../../ui/interfaces/ILobbyUI";
import {ResponseManager} from "../communication/receiver/ResponseManager";
import {RequestEmitter} from "../communication/requester/emitter/RequestEmitter";
import {RequestManager} from "../communication/requester/RequestManager";
import {Room} from "./Room";

export class Lobby {

    private _room: Room;
    private _requestEmitter: RequestEmitter;

    /**
     *
     * @param {ILobbyUI} _ui
     */
    constructor(private _ui: ILobbyUI) {
        this._requestEmitter = RequestManager.requestEmitter;
        ResponseManager.createLobbyListener(this);
    }

    /**
     * return current room
     * @returns {Room}
     */
    public get room(): Room {
        return this._room;
    }

    /**
     * Update displayed game info
     * @param {string} info
     */
    public updateGameInfo(info: string) {
        this._ui.updateGameInfo(info);
    }

    /**
     * Update displayed list of available rooms
     * @param {IRoomListResponse} rooms
     */
    public updateRoomList(rooms: IRoomListResponse): void {
        this._ui.updateRoomList(rooms);
    }

}
