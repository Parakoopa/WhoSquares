import * as React from "react";
import {OtherPlayer} from "../../../game/OtherPlayer";
import {render} from "react-dom";

export interface IPlayerListProps {
    players: IPlayer[];
}

export interface IPlayerListState {
}

export class PlayerList extends React.Component<IPlayerListProps, IPlayerListState> {

    private getActivePlayerColorHtml(player: IPlayer): string {
        let color;
        if (player == null)
            color = 0;
        else
            color = player.color;

        return "#" + color.toString(16);
    }

    private styleInfo(player: IPlayer): any {
        const styleTurnInfo = {
            color: this.getActivePlayerColorHtml(player),
            fontWeight: 900,
        };
        return styleTurnInfo;
    }

    public render(): any {

        const playerlist = this.props.players.map((player, i) =>
            <li key={i} style={this.styleInfo(player)}>{player.name}</li>
        );

        return <div>
            <label>Players: </label>
            <ol className={"players"}>
                {playerlist}
            </ol>
        </div>;
    }
}
