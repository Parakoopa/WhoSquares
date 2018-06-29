import * as React from "react";
import {GameManager} from "../../game/GameManager";

export interface IGameProps {

}
export interface IGameState {

}

export class Game extends React.Component<IGameProps, IGameState> {
    private gameManager: GameManager;

    public componentDidMount(): void {
        // Init game
        this.gameManager = new GameManager();
    }

    public render() {
        return <div id="game" />;
    }
}
