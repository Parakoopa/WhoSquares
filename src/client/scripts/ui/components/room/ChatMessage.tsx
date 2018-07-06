import * as React from "react";

export interface IChatMessageProps {
    player: IPlayer;
    message: string;
}

export interface IChatMessageState {
}

export class ChatMessage extends React.Component<IChatMessageProps, IChatMessageState> {

    public render(): any {
        return (
            <div className={`message`}>
                <div className="username">
                    { this.props.player.name }
                </div>
                <div className="message-body">
                    { this.props.message }
                </div>
            </div>
        );
    }
}
