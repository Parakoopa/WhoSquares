import * as React from "react";
import {LocalPlayer} from "../../../game/entity/LocalPlayer/LocalPlayer";
import {LocalPlayerManager} from "../../../game/entity/LocalPlayer/LocalPlayerManager";
import {Player} from "./Player";

export interface IPlayerListProps {
    players: IPlayer[];
    winner: IPlayer;
    turn: IPlayer;
}

export interface IPlayerListState {
}

export class PlayerList extends React.Component<IPlayerListProps, IPlayerListState> {

    public render(): any {

        const playerlist = this.props.players.map((player, i) => {
            const isWinner = LocalPlayerManager.equalsIPlayer(this.props.winner, player);
            const isTurn = LocalPlayerManager.equalsIPlayer(this.props.turn, player);
            return (<Player key={i} player={player} winner={isWinner} turn={isTurn}/>);
        });

        return <div>
            <label>Players: </label>
            <div className={"players"}>
                {playerlist}
            </div>
        </div>;
    }
}
