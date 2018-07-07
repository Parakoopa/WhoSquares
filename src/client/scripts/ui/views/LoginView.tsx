import * as React from "react";
import {Connection} from "../../Connection";
import {ILoginUI} from "../interfaces/ILoginUI";
import {Routes} from "../Routes";
import {ResponseManager} from "../../game/ResponseManager/ResponseManager";
import {Login} from "../../game/components/Login";
import {App} from "../App";
import {Utility} from "../../game/Utility";

export interface ILoginViewProps {
}

export interface ILoginViewState {
    username: string;
}

export class LoginView extends React.Component<ILoginViewProps, ILoginViewState> implements ILoginUI {

    private login_backend: Login;

    constructor(props: ILoginViewProps) {
        super(props);

        this.state = {username: ""};

        Connection.initSocket();

        this.login_backend = new Login(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        const username = Connection.getUsername();
        const key = Connection.getKey();

        if (key && username) {
            const color = parseInt("FF33FF", 16);
            const name = username;
            const isObserver = true;

            Utility.addLocalPlayer(
                {name, color, isObserver},
                Connection.getKey(),
                Connection.getSocket()
            );

            window.location.href = Routes.linkToLobbyHREF();
            return;
        }

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
        const name = this.state.username;

        Connection._socket.emit("register", {name});
        Connection._socket.once("registered", (resp: IRegisteredResponse) => {
            Connection.setKey(resp.key);
            Connection.setUsername( name );

            const color = parseInt("FF33FF", 16);
            const isObserver = true;

            Utility.addLocalPlayer(
                {name, color, isObserver},
                Connection.getKey(),
                Connection.getSocket()
            );

            window.location.href = Routes.linkToLobbyHREF();
        });
    }

    public componentDidMount() {
        this.setState( {username: Connection.getUsername()});
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
