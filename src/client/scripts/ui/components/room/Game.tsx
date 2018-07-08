import * as React from "react";

export interface IGameProps {
}

export interface IGameState {

}

export class Game extends React.Component<IGameProps, IGameState> {

    public render(): any {
        return <div id="game"/>;
    }
}
