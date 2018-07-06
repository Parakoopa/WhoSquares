import * as React from "react";
import {ChatMessage} from "./ChatMessage";

export interface IChatMessagesProps {
    messages: ChatMessage[];
}

export interface IChatMessagesState {
}

export class ChatMessages extends React.Component<IChatMessagesProps, IChatMessagesState> {

    private static ID = "MessageList";

    constructor(props: IChatMessagesProps) {
        super(props);

        this.state = {messages: []};
    }

    public componentDidUpdate() {
        const objDiv = document.getElementById(ChatMessages.ID);
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    public render(): any {
        const messages = this.props.messages.map((message, i) => {
            return (
                <ChatMessage key={i} player={message.props.player} message={message.props.message}/>
            );
        });
        return (
            <div className="messages" id={ChatMessages.ID}>
                {messages}
            </div>
        );
    }
}
