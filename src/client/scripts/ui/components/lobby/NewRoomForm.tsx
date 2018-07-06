import * as React from "react";

export interface INewRoomFormProps {
    actionCreate: (roomname: string) => void;
}

export interface INewRoomFormState {
    roomname: string;
}

export class NewRoomForm extends React.Component<INewRoomFormProps, INewRoomFormState> {

    constructor(props: INewRoomFormProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {roomname: ""};
    }

    private handleSubmit(event: any) {
        event.preventDefault();

        this.props.actionCreate( this.state.roomname );
    }

    private handleChange(event: any) {
        this.setState({roomname: event.target.value});
    }

    private validateForm() {
        return this.state.roomname.length > 0;
    }

    public render(): any {
        return <form onSubmit={this.handleSubmit}>
            <h3>CREATE ROOM</h3>
            <input className={"input"} type="text" value={this.state.roomname} onChange={this.handleChange}/>
            <br/>
            <input className={"button"} type="submit" disabled={!this.validateForm()} value="Create"/>
        </form>;
    }
}
