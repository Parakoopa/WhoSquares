import * as React from "react";

export interface IGameControlProps {
    actionStartGame: () => void;
    actionLeaveRoom: () => void;
    gameAlreadyStarted: boolean;
}

export interface IGameControlState {
}

export class GameControl extends React.Component<IGameControlProps, IGameControlState> {

    constructor(props: IGameControlProps) {
        super(props);

        this.startGame = this.startGame.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);

        this.state = {roomname: ""};
    }

    private leaveRoom() {
        this.props.actionLeaveRoom();
    }

    private startGame() {
        this.props.actionStartGame();
    }

    public render(): any {
        return <div>
            {!this.props.gameAlreadyStarted
                && <button className={"button"} onClick={this.startGame}>Start Game</button> }
            <button className={"button"} onClick={this.leaveRoom}>Leave Room</button>
        </div>;
    }
}
