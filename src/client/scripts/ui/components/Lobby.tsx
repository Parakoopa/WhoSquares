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
        const divStyle = {
            "width": "fit-content",
            "text-align": "center",
            "vertical-align": "center",
            "font-size": "1.25em",
        };

        const buttonStyle = {
            "backgroundColor": "#162856",
            "border": "3px solid #7887AB",
            "font-size": "0.75em",
            "color": "White",
            "margin": "5px",
            "padding-top": "5px",
            "text-align": "center"
        };

        const roomlist = [
            "room01",
            "room02"
        ].map((name) =>
            <div>
                <Link to={this.getGameURL(name)}>
                    <button style={buttonStyle}>
                        {name}
                    </button>
                </Link>
            </div>
        );

        return <div style={divStyle}>
            {roomlist}
        </div>;
    }
}
