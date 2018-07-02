import * as React from "react";
import {GameManager} from "../../game/GameManager";
import {Routes} from "../Routes";

export interface IRoomProps {
    roomid: string;
    username: string;
}

export interface IRoomState {
}

export class Room extends React.Component<IRoomProps, IRoomState> {

    private gameManager: GameManager;

    constructor( props: IRoomProps ) {
        super( props );

        this.leaveRoom = this.leaveRoom.bind(this);
    }

    public getUsername() {
        return this.props.username;
    }

    public leaveRoom() {
        if (this.gameManager !== undefined )
            this.gameManager.actionLeaveRoom();
    }

    public leftRoom() {
        window.location.href = Routes.linkToLobbyHREF( this.props.username );
    }

    public componentDidMount(): void {
        // Init game
        this.gameManager = new GameManager(this);
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
            "display": "block",
            "margin": "0 auto",
            "width": "fit-content",
            "margin-top": "1em",
            "backgroundColor": "#162856",
            "border": "3px solid #7887AB",
            "padding": "0.25em 1em",
            "font-size": "0.75em",
            "color": "White",
            "alignment": "center",
        };

        return <div style={divStyle}>
            <div id="game" />
            <button style={buttonStyle} onClick={this.leaveRoom}>Leave Room</button>
        </div>;
    }
}
