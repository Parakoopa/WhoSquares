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
            <div>
                <div className={`message`}>
                    <div className={"arrow bottom right"}></div>
                    <span className="username">
                    {this.props.player.name}
                </span>
                    <span>: </span>
                    <span className="message-body">
                    {this.props.message}
                </span>
                </div>
            </div>
        );
    }
}
