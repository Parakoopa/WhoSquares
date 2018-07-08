import * as React from "react";
import {Utility} from "../../../game/Utility";
import {App} from "../../App";

export interface IChatMessageProps {
    player: IPlayer;
    message: string;
}

export interface IChatMessageState {
}

export class ChatMessage extends React.Component<IChatMessageProps, IChatMessageState> {

    public render(): any {
        const own = Utility.equalsLocalPlayer( this.props.player );
        const className = own ? "message own" : "message";

        return (
            <div className={className}>
                <span className="username">
                    { this.props.player.name }
                </span>
                <span>: </span>
                <span className="message-body">
                    { this.props.message }
                </span>
            </div>
        );
    }
}
