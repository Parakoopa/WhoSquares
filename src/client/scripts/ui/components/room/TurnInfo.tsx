import * as React from "react";

export interface ITurnInfoProps {
    player: IPlayer;
}

export interface ITurnInfoState {
}

export class TurnInfo extends React.Component<ITurnInfoProps, ITurnInfoState> {

    private getActivePlayerColorHtml(): string {
        let color;
        if (this.props.player == null)
            color = 0;
        else
            color = this.props.player.color;

        return "#" + color.toString(16);
    }

    public getActivePlayerName(): string {
        if (this.props.player == null)
            return "";
        else
            return this.props.player.name;
    }

    public render(): any {
        const styleTurnInfo = {
            color: this.getActivePlayerColorHtml(),
        };

        return <div>
            <label>Next: </label>
            <label className={"directive"} style={styleTurnInfo}>
                {this.getActivePlayerName()}
            </label>
        </div>;
    }
}
