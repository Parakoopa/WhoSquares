import * as React from "react";

export interface IWinnerInfoProps {
    winner: IPlayer;
}

export interface IWinnerInfoState {
}

export class WinnerInfo extends React.Component<IWinnerInfoProps, IWinnerInfoState> {

    public getWinnerName(): string {
        if (this.props.winner == null)
            return "";
        else
            return this.props.winner.name;
    }

    public render(): any {
        return <div><label>Winner: {this.getWinnerName()}</label></div>;
    }
}
