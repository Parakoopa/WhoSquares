import * as React from "react";
import {Redirect} from "react-router-dom";
import {Routes} from "../Routes";
import {render} from "react-dom";

export interface ILoginProps {
}

export interface ILoginState {
    username: string;
    fireRedirect: boolean;
}

export class Login extends React.Component<ILoginProps, ILoginState> {

    constructor(props: ILoginProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {username: "", fireRedirect: false};
    }

    private validateForm() {
        return this.state.username.length > 0;
    }

    private handleChange(event: any) {
        this.setState({username: event.target.value});
    }

    private handleSubmit(event: any) {
        event.preventDefault();
        this.setState({fireRedirect: true});
    }

    public render() {
        const {fireRedirect} = this.state;

        const divStyle = {
            "width": "fit-content",
            "text-align": "center",
            "vertical-align": "center",
            "font-size": "1.25em",
        };

        const inputStyle = {
            "width": "fit-content",
            "padding": "5px",
            "backgroundColor": "#162856",
            "border": "3px solid #7887AB",
            "font-size": "0.75em",
            "color": "White",
            "text-align": "center"
        };

        const submitStyle = {
            "backgroundColor": "#162856",
            "border": "3px solid #7887AB",
            "font-size": "0.75em",
            "color": "White",
            "margin": "5px",
            "padding-top": "5px",
            "text-align": "center"
        };

        return (
            <div style={divStyle} className="Login">
                <form onSubmit={this.handleSubmit}>
                    <h1>USERNAME</h1>
                    <input style={inputStyle} type="text" value={this.state.username} onChange={this.handleChange}/>
                    <br/>
                    <input style={submitStyle} type="submit" disabled={!this.validateForm()} value="OK"/>
                </form>
                {fireRedirect && (
                    <Redirect to={Routes.linkToLobby(this.state.username)}/>
                )}
            </div>
        );
    }
}
