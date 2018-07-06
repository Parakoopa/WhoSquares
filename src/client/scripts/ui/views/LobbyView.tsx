import * as React from "react";
import {Connection} from "../../Connection";
import {NewRoomForm} from "../components/lobby/NewRoomForm";
import {RoomList} from "../components/lobby/RoomList";
import {Routes} from "../Routes";

export interface ILobbyViewProps {
    username: string;
}

export interface ILobbyViewState {
    roomlist: string[];
}

export class LobbyView extends React.Component<ILobbyViewProps, ILobbyViewState> {

    constructor(props: ILobbyViewProps) {
        super(props);

        this.joinRoom = this.joinRoom.bind(this);

        this.state = {roomlist: [] };

        console.log( "Join lobby!");
        const ok = Connection.joinLobby((resp: IJoinLobbyEvent) => {
            console.log( "updated roomlist");
            this.setState({roomlist: resp.rooms});
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
            <RoomList roomlist={this.state.roomlist} actionJoinRoom={this.joinRoom}/>
            <NewRoomForm actionCreate={this.joinRoom}/>
        </div>;
    }
}
