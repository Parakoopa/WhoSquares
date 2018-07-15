import * as React from "react";
import {LocalPlayerManager} from "../../../game/entity/LocalPlayer/LocalPlayerManager";

export interface IPlayerProps {
    player: IPlayer;
    winner: boolean;
    turn: boolean;
}

export interface IPlayerState {
}

/**
 * Defines a Player for the Playerlist.
 */
export class Player extends React.Component<IPlayerProps, IPlayerState> {
    private getActivePlayerColorHtml(): string {
        let color;
        if (this.props.player == null)
            color = 0;
        else
            color = this.props.player.color;

        return "#" + color.toString(16);
    }

    public render(): any {
        const isWinner = this.props.winner ? " winner " : "";
        const isTurn = this.props.turn ? " turn " : "";

        const className = "player" + isWinner + isTurn;

        const styleUsername = {
            color: this.getActivePlayerColorHtml(),
        };

        return (
            <div>
                <div className={className}>
                    <span>
                        { isWinner ?
                            <img className={"winnerIcon"} src="../../../../img/icons/Winner_True.png"
                                 width={"20em"} height={"20em"} /> :
                            <img className={"winnerIcon"} src="../../../../img/icons/Winner_False.png"
                                 width={"20em"} height={"20em"} />
                        }
                    </span>
                    <span style={styleUsername} className="username">
                        {this.props.player.name}
                    </span>
                </div>
            </div>
        );
    }
}
