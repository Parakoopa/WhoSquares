import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Connection} from "../../Connection";
import {Login} from "../../game/components/Login";
import {LocalPlayerManager} from "../../game/entity/LocalPlayer/LocalPlayerManager";
import {App} from "../App";
import {ILoginUI} from "../interfaces/ILoginUI";
import {Routes} from "../Routes";

export interface ILoginViewProps extends RouteComponentProps<{ jumpToRoom: string }> {
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

            LocalPlayerManager.addLocalPlayer(
                {name, color, isObserver},
                Connection.getKey(),
                Connection.getSocket()
            );

            window.location.href = this.redirectAfterLogin();
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
            Connection.setUsername(name);

            const color = parseInt("FF33FF", 16);
            const isObserver = true;

            LocalPlayerManager.addLocalPlayer(
                {name, color, isObserver},
                Connection.getKey(),
                Connection.getSocket()
            );

            window.location.href = this.redirectAfterLogin();
        });
    }

    public componentDidMount() {
        this.setState({username: Connection.getUsername()});
    }

    private redirectAfterLogin(): string {
        if (this.props.match.params.jumpToRoom) {
            return Routes.linkToGameHREF(this.props.match.params.jumpToRoom);
        }
        return Routes.linkToLobbyHREF();
    }

    public render() {
        return <div className={"content"}>
            <form onSubmit={this.handleSubmit}>
                <h3 className={"description"}>username:</h3>
                <div className={"login"}>
                    <span className={"emptyBox"}/>
                    <input className={"input"} type="text"
                           value={this.state.username} onChange={this.handleChange}/>
                    <input className={"button"} type="submit"
                           disabled={!this.validateForm()} value="OK"/>
                </div>
            </form>
        </div>;
    }
}
