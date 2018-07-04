import * as React from "react";
import {render} from "react-dom";
import {Redirect} from "react-router-dom";
import {Connection} from "../../Connection";
import {App, IAppProps} from "../App";
import {Routes} from "../Routes";

export interface ILoginProps {
}

export interface ILoginState {
    username: string;
}

export class Login extends React.Component<ILoginProps, ILoginState> {

    constructor(props: ILoginProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        const username = Connection.getUsername();

        this.state = {username};
    }

    private validateForm() {
        if (this.state.username === undefined)
            return false;
        else
            return this.state.username.length > 0;
    }

    private handleChange(event: any) {
        this.setState({username: event.target.value});
    }

    private handleSubmit(event: any) {
        event.preventDefault();

        this.login();
    }

    private login(): void {
        const ok = Connection.login(this.state.username, () => {
            window.location.href = Routes.linkToLobbyHREF(Connection.getUsername());
        });

        if (!ok)
            alert("Connection failed, please try again!");
    }

    public render() {
        return (
            <div className={"content"}>
                <form onSubmit={this.handleSubmit}>
                    <h3 className={"description"}>username:</h3>
                    <div className={"content"}>
                        <span id={"empty"}/>
                        <input className={"input"} type="text"
                               value={this.state.username} onChange={this.handleChange}/>
                        <input className={"button"} type="submit"
                               disabled={!this.validateForm()} value="OK"/>
                    </div>
                </form>
            </div>
        );
    }
}
