import * as React from "react";
import {LocalPlayerManager} from "../../../game/entity/LocalPlayer/LocalPlayerManager";

export interface IPlayerProps {
    player: IPlayer;
    winner: boolean;
    turn: boolean;
}

export interface IPlayerState {
}

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
                    <div>
                        { isWinner ? <img src="../../../img/mission_Square.png"/> : null}
                    </div>
                    <div style={styleUsername} className="username">
                        {this.props.player.name}
                    </div>
                </div>
            </div>
        );
    }
}
