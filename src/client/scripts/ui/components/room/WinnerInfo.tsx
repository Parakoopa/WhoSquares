import * as React from "react";

export interface IWinnerInfoProps {
    winner: IPlayer;
}

export interface IWinnerInfoState {
}

/**
 * Defines the WinnerInfo-Component.
 */
export class WinnerInfo extends React.Component<IWinnerInfoProps, IWinnerInfoState> {

    /**
     * Gets the WinnerName, empty if null.
     *
     * @returns {string}
     */
    public getWinnerName(): string {
        if (this.props.winner == null)
            return "";
        else
            return this.props.winner.name;
    }

    public render(): any {
        return <div>
            <label>Winner: </label>
            <label className={"directive"}>{this.getWinnerName()}</label>
        </div>;
    }
}
