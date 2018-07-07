import * as React from "react";
import {Connection} from "../../Connection";
import {NewRoomForm} from "../components/lobby/NewRoomForm";
import {RoomList} from "../components/lobby/RoomList";
import {Routes} from "../Routes";
import {Lobby} from "../../game/components/Lobby";
import {ILobbyUI} from "../interfaces/ILobbyUI";
import {App} from "../App";
import {LocalPlayer} from "../../game/LocalPlayer";
import {Utility} from "../../game/Utility";

export interface ILobbyViewProps {
    username: string;
}

export interface ILobbyViewState {
    roomList: string[];
}

export class LobbyView extends React.Component<ILobbyViewProps, ILobbyViewState> implements ILobbyUI {

    private lobby_backend: Lobby;

    constructor(props: ILobbyViewProps) {
        super(props);

        this.joinRoom = this.joinRoom.bind(this);

        this.state = {roomList: []};

        Connection.initSocket();

        if (!Connection.getKey() || !Connection.getUsername()) {
            window.location.href = Routes.linkToLoginHREF();
            return;
        }

        if (!Utility.getLocalPlayer()) {
            const color = parseInt("FF33FF", 16);
            const name = Connection.getUsername();
            const isObserver = true;

            Utility.addLocalPlayer(
                {name, color, isObserver},
                Connection.getKey(),
                Connection.getSocket()
            );
        }

        this.lobby_backend = new Lobby(this, null, Utility.getLocalPlayer() );

        Connection._socket.emit("roomList");
        Connection._socket.once("roomList", (roomList: string[]) => {
            this.setState({roomList});
        });
    }

    private joinRoom(roomname: string) {
        window.location.href = Routes.linkToGameHREF(roomname);
    }

    public updateGameInfo(info: string): void {
        App.showTextOnSnackbar(info);
    }

    public updateRoomList(rooms: string[]): void {
        this.state = {roomList: rooms};
    }

    public render() {
        return <div className={"content"}>
            <h3 className={"description"}> Available Rooms: </h3>
            <RoomList roomlist={this.state.roomList} actionJoinRoom={this.joinRoom}/>
            <NewRoomForm actionCreate={this.joinRoom}/>
        </div>;
    }
}
