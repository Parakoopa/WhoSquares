import * as React from "react";
import {Link} from "react-router-dom";
import {Routes} from "../Routes";
import {App} from "../App";
import {GameManager} from "../../game/GameManager";
import {Connection} from "../../Connection";
import {RoomList} from "./lobby/RoomList";
import {NewRoomForm} from "./lobby/NewRoomForm";

export interface ILobbyProps {
    username: string;
}

export interface ILobbyState {
    roomlist: string[];
}

export class Lobby extends React.Component<ILobbyProps, ILobbyState> {

    constructor(props: ILobbyProps) {
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
