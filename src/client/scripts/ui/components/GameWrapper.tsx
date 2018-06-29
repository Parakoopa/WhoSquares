import * as React from "react";
import {GameManager} from "../../game/GameManager";

export interface IGameProps {
    roomid: string;
}

export interface IGameState {

}

export class GameWrapper extends React.Component<IGameProps, IGameState> {
    private gameManager: GameManager;

    constructor( props: IGameProps ) {
        super( props );
    }

    public leftRoom() {
        window.location.href = "/#/lobby";
    }

    public componentDidMount(): void {
        // Init game
        this.gameManager = new GameManager(this);
    }

    public render() {
        return <div id="game"/>;
    }
}
