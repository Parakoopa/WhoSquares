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

/**
 * Defines the Playerlist-Component.
 */
export class PlayerList extends React.Component<IPlayerListProps, IPlayerListState> {

    public render(): any {

        // Maps the Playernames to individual Players for the Playerlist
        const playerlist = this.props.players.map((player, i) => {
            const isWinner = LocalPlayerManager.equalsIPlayer(this.props.winner, player);
            const isTurn = LocalPlayerManager.equalsIPlayer(this.props.turn, player);
            return (<Player key={i} player={player} winner={isWinner} turn={isTurn}/>);
        });

        return <div>
            <label className={"title"}>Players</label>
            <img alt="Players"
                 className={"iconPlayers"}
                 src={"../../img/icons/Players.png"}
                 width="30em" height="30em"
            />
            <div className={"players"}>
                {playerlist}
            </div>
        </div>;
    }
}
