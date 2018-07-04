import * as React from "react";
import {Link} from "react-router-dom";
import {Routes} from "../Routes";

export interface ILobbyProps {
    username: string;
}

export interface ILobbyState {
}

export class Lobby extends React.Component<ILobbyProps, ILobbyState> {

    constructor(props: ILobbyProps) {
        super(props);
    }

    private getGameURL(roomid: string) {
        return Routes.linkToGame(this.props.username, roomid);
    }

    public render() {

        const roomlist = [
            "room01",
            "room02"
        ].map((name) =>
            <div key={name}>
                <Link to={this.getGameURL(name)}>
                    <button className={"room"}>
                        {name}
                    </button>
                </Link>
            </div>
        );

        return <div className={"content"}>
            <h3 className={"description"}> Available Rooms: </h3>
            {roomlist}
        </div>;
    }
}
