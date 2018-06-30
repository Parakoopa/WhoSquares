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
        return <div>
            <h1>Lobby</h1>

            <Link to={this.getGameURL("room01")}>
                <button>
                    Join Room "room01"
                </button>
            </Link>
            <Link to={this.getGameURL("room02")}>
                <button>
                    Join Room "room02"
                </button>
            </Link>
        </div>;
    }
}
