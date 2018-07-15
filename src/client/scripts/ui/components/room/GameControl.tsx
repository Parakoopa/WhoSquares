import * as React from "react";
import {Routes} from "../../Routes";

export interface IGameControlProps {
    actionStartGame: () => void;
    actionLeaveRoom: () => void;
    gameEnded: boolean;
    gameAlreadyStarted: boolean;
    roomid: string;
}

export interface IGameControlState {
}

/**
 * Defines a GameControl-Component. The buttons disappear and appear with different gamestati!
 */
export class GameControl extends React.Component<IGameControlProps, IGameControlState> {

    constructor(props: IGameControlProps) {
        super(props);

        this.startGame = this.startGame.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.goToStats = this.goToStats.bind(this);

        this.state = {roomname: ""};
    }

    private leaveRoom() {
        this.props.actionLeaveRoom();
    }

    private startGame() {
        this.props.actionStartGame();
    }

    private goToStats() {
        window.location.href = Routes.linkToGameStatsHREF(this.props.roomid);
    }

    public render(): any {
        return <div>
            {this.props.gameEnded
                && <button className={"button"} onClick={this.goToStats}>SHOW STATISTICS</button> }
            {!this.props.gameAlreadyStarted
                && <button className={"button"} onClick={this.startGame}>Start Game</button> }
            {!this.props.gameEnded
                && <button className={"button"} onClick={this.leaveRoom}>Leave Room</button> }
        </div>;
    }
}
