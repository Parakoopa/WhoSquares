import * as React from "react";
import {Route} from "react-router";
import {Footer} from "./Footer";
import {Header} from "./Header";
import {Routes} from "./Routes";
import {LobbyView} from "./views/LobbyView";
import {LoginView} from "./views/LoginView";
import {RoomView} from "./views/RoomView";
import {GameManager} from "../game/GameManager";
import {IRoomProps} from "./components/Room";

export interface IAppProps {
    name: string;
}

export interface IAppState {

}

export class App extends React.Component<IAppProps, IAppState> {

    public static _socket: SocketIOClient.Socket;

    public render(): any {
        const routes = [
            {
                path: Routes.APP_DEF,
                exact: true,
                component: LoginView
            },
            {
                path: Routes.LOGIN_DEF,
                component: LoginView
            },
            {
                path: Routes.LOBBY_DEF,
                component: LobbyView
            },
            {
                path: Routes.GAME_DEF,
                component: RoomView
            }
        ];

        const divStyle = {
            "backgroundColor": "#061539",
            "height": "100%",
            "width": "100%",
            "display": "flex",
            "flex-direction": "column",
            "align-items": "center",
        };

        return <div style={divStyle}>
            <Header />
            {routes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                />
            ))}
            <Footer/>
        </div>;
    }
}
