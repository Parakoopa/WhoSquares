import * as React from "react";
import {Connection} from "../../Connection";
import {NewRoomForm} from "../components/lobby/NewRoomForm";
import {RoomList} from "../components/lobby/RoomList";
import {Routes} from "../Routes";

export interface ILobbyViewProps {
    username: string;
}

export interface ILobbyViewState {
    roomList: string[];
}

export class LobbyView extends React.Component<ILobbyViewProps, ILobbyViewState> {
    // ToDo create Lobby

    constructor(props: ILobbyViewProps) {
        super(props);

        this.joinRoom = this.joinRoom.bind(this);

        this.state = {roomList: [] };

        console.log( "Join lobby!");
        const ok = Connection.joinLobby((resp: IJoinLobbyEvent) => {
            console.log( "updated roomList");
            this.setState({roomList: resp.rooms});
        });

        if (!ok) {
            console.log( "Back to Login!");
            window.location.href = Routes.linkToLoginHREF();
            return;
        }
    }

    private joinRoom(roomname: string) {
        Connection.setRoomname( roomname );
        Connection.joinRoom( () => {
            window.location.href = Routes.linkToGameHREF(roomname);
        });
    }

    public render() {
        return <div className={"content"}>
            <h3 className={"description"}> Available Rooms: </h3>
            <RoomList roomList={this.state.roomList} actionJoinRoom={this.joinRoom}/>
            <NewRoomForm actionCreate={this.joinRoom}/>
        </div>;
    }
}
