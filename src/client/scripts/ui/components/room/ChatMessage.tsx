import * as React from "react";
import {Utility} from "../../../game/Utility";

export interface IChatMessageProps {
    player: IPlayer;
    message: string;
}

export interface IChatMessageState {
}

export class ChatMessage extends React.Component<IChatMessageProps, IChatMessageState> {

    public render(): any {
        const own = Utility.equalsLocalPlayer( this.props.player );
        const isOwn = own ? "own" : "";

        return (
            <div>
                <div className={isOwn + "message"}>
                    <div className={isOwn + "arrow " + isOwn + "bottom right"}></div>
                    <div className="username">
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
