import * as React from "react";
import {Redirect} from "react-router-dom";
import {Routes} from "../Routes";

export interface ILoginProps {
}

export interface ILoginState {
    username: string;
    fireRedirect: boolean;
}

export class Login extends React.Component<ILoginProps, ILoginState> {

    constructor( props: ILoginProps ) {
        super( props );

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = { username: "", fireRedirect: false};
    }

    private validateForm() {
        return this.state.username.length > 0;
    }

    private handleChange(event: any) {
        this.setState({username: event.target.value});
    }

    private handleSubmit( event: any ) {
        event.preventDefault();
        this.setState({ fireRedirect: true });
    }

    public render() {
        const { fireRedirect } = this.state;

        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Username:
                        <input type="text" value={this.state.username} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" disabled={!this.validateForm()} value="Submit" />
                </form>
                {fireRedirect && (
                    <Redirect to={Routes.linkToLobby( this.state.username )}/>
                )}
            </div>
        );
    }
}
