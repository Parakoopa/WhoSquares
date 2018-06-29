import * as React from "react";
import {Link} from "react-router-dom";

export interface ILobbyProps {

}

export interface ILobbyState {

}

export class Lobby extends React.Component<ILobbyProps, ILobbyState> {

    constructor( props: ILobbyProps ) {
        super( props );
    }

    public render() {
        return <div>
            <h1>Lobby</h1>

            <Link to="/game/room01">
                <button>
                    Join Room "room01"
                </button>
            </Link>
            <Link to="/game/room02">
                <button>
                    Join Room "room02"
                </button>
            </Link>
        </div>;
    }
}
