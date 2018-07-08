import * as React from "react";
import {Utility} from "../../../game/Utility";

export interface IChatMessageProps {
    player: IPlayer;
    message: string;
}

export interface IChatMessageState {
}

export class ChatMessage extends React.Component<IChatMessageProps, IChatMessageState> {
    private getActivePlayerColorHtml(): string {
        let color;
        if (this.props.player == null)
            color = 0;
        else
            color = this.props.player.color;

        return "#" + color.toString(16);
    }

    public render(): any {
        const own = Utility.equalsLocalPlayer( this.props.player );
        const isOwn = own ? "own" : "";

        const styleUsername = {
            color: this.getActivePlayerColorHtml(),
        };

        return (
            <div>
                <div className={isOwn + "message"}>
                    <div className={isOwn + "arrow " + isOwn + "bottom right"}></div>
                    <div style={styleUsername} className="username">
                        { this.props.player.name }
                    </div>
                    <div className="message-body">
                        { this.props.message }
                    </div>
                </div>
            </div>
        );
    }
}
