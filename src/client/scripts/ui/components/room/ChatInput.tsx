import * as React from "react";

export interface IChatInputProps {
    onSend: (message: string) => void;
}

export interface IChatInputState {
    text: string;
}

export class ChatInput extends React.Component<IChatInputProps, IChatInputState> {

    constructor(props: IChatInputProps) {
        super(props);

        this.state = { text: "" };

        this.submitHandler = this.submitHandler.bind(this);
        this.textChangeHandler = this.textChangeHandler.bind(this);
    }

    public submitHandler(event: any) {
        event.preventDefault();
        this.props.onSend(this.state.text);
        this.setState({text: ""});
    }

    public textChangeHandler(event: any) {
        this.setState({text: event.target.value});
    }

    public render(): any {
        return (
            <form className="chat-input" onSubmit={this.submitHandler}>
                <input className={"chatinput"}
                       type="text"
                       onChange={this.textChangeHandler}
                       value={this.state.text}
                       placeholder="Write a message..."
                       required/>
            </form>
        );
    }
}
