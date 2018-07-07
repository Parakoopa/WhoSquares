import * as React from "react";
import {Connection} from "../../Connection";
import {ILoginUI} from "../interfaces/ILoginUI";
import {Routes} from "../Routes";
import {ResponseManager} from "../../game/ResponseManager/ResponseManager";
import {Login} from "../../game/components/Login";
import {App} from "../App";

export interface ILoginViewProps {
}

export interface ILoginViewState {
    username: string;
}

export class LoginView extends React.Component<ILoginViewProps, ILoginViewState> implements ILoginUI {

    private login_backend: Login;

    constructor(props: ILoginViewProps) {
        super(props);

        Connection.initSocket();

        this.login_backend = new Login(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        const username = Connection.getUsername();
        const key = Connection.getKey();

        if (key) {
            const color = parseInt("FF33FF", 16);
            const name = username;
            const isObserver = true;

            Connection.setLocalPlayerParams(name, color, isObserver);

            this.login_backend.addLocalPlayer(
                Connection.getLocalPlayer(),
                Connection.getKey(),
                Connection.getSocket()
            );

            window.location.href = Routes.linkToLobbyHREF();
            return;
        }

        this.state = {username};
    }

    public updateGameInfo(info: string): void {
        App.showTextOnSnackbar(info);
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
        const username = this.state.username;

        Connection._socket.emit("register", {username});
        Connection._socket.once("registered", (resp: IRegisteredResponse) => {
            Connection.setKey(resp.key);

            const color = parseInt("FF33FF", 16);
            const name = username;
            const isObserver = true;

            Connection.setLocalPlayerParams(name, color, isObserver);

            this.login_backend.addLocalPlayer(
                Connection.getLocalPlayer(),
                Connection.getKey(),
                Connection.getSocket()
            );

            window.location.href = Routes.linkToLobbyHREF();
        });
    }

    public render() {
        return <div className={"content"}>
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
        </div>;
    }
}
