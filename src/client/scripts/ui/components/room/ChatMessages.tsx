import * as React from "react";
import {ChatMessage} from "./ChatMessage";

export interface IChatMessagesProps {
    messages: ChatMessage[];
}

export interface IChatMessagesState {
}

/**
 * Defines a List of ChatMessages
 */
export class ChatMessages extends React.Component<IChatMessagesProps, IChatMessagesState> {

    private static ID = "MessageList";

    constructor(props: IChatMessagesProps) {
        super(props);

        this.state = {messages: []};
    }

    /**
     * After a new Update, Scroll to the bottom to see newest Message!
     */
    public componentDidUpdate() {
        const objDiv = document.getElementById(ChatMessages.ID);
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    public render(): any {
        // Maps the messages to an individual ChatMessage!
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
