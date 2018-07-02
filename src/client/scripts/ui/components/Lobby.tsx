import * as React from "react";
import {Link} from "react-router-dom";
import {Routes} from "../Routes";

export interface ILobbyProps {
    username: string;
}

export interface ILobbyState {
}

export class Lobby extends React.Component<ILobbyProps, ILobbyState> {

    constructor( props: ILobbyProps ) {
        super( props );
    }

    private getGameURL( roomid: string) {
        return Routes.linkToGame( this.props.username, roomid );
    }

    public render() {
        const divStyle = {
            "width": "fit-content",
            "text-align": "center",
            "vertical-align": "center",
            "font-size": "1.25em",
            "margin-bottom": "3em",
        };

        const buttonStyle = {
            "width": "fit-content",
            "margin-left": "1em",
            "margin-top": "1em",
            "backgroundColor": "#162856",
            "border": "3px solid #7887AB",
            "padding": "0.25em 1em",
            "font-size": "0.75em",
            "color": "White",
        };

        return <div style={divStyle}>
            <div>Available Rooms:</div>

            <Link to={this.getGameURL("room01")}>
                <button style={buttonStyle}>
                    Join Room "room01"
                </button>
            </Link>
            <Link to={this.getGameURL("room02")}>
                <button style={buttonStyle}>
                    Join Room "room02"
                </button>
            </Link>
        </div>;
    }
}
