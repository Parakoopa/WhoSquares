import * as React from "react";
import {OtherPlayer} from "../../../game/OtherPlayer";

export interface IPlayerListProps {
    players: OtherPlayer[];
}

export interface IPlayerListState {
}

export class PlayerList extends React.Component<IPlayerListProps, IPlayerListState> {

    public render(): any {
        const playerlist = this.props.players.map((player, i) =>
            <li key={i}>{player.name}</li>
        );

        return <div>
            <label>Players: </label>
            {playerlist}
        </div>;
    }
}
