import * as React from "react";

export interface IGameProps {
}

export interface IGameState {

}

/**
 * Defines the Game-Component. Just creates a div with the id "game".
 * Phaser is recognize this and creates a Canvas in this DIV!
 */
export class Game extends React.Component<IGameProps, IGameState> {

    public render(): any {
        return <div className={"game"} id="game"/>;
    }
}
