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
        return <div>
            <button onClick={this.leaveRoom}>Leave Room</button>
            <div id="game" />
        </div>;
    }
}
