import * as React from "react";
import {Route} from "react-router";
import {Footer} from "./Footer";
import {Header} from "./Header";
import {Routes} from "./Routes";
import {LobbyView} from "./views/LobbyView";
import {LoginView} from "./views/LoginView";
import {RoomView} from "./views/RoomView";
import {RoomStatsView} from "./views/RoomStatsView";

export interface IAppProps {
    name: string;
}

export interface IAppState {

}

/**
 * Managed the Header, the Views (over Routes), the Footer and the Snackbar.
 */
export class App extends React.Component<IAppProps, IAppState> {

    /**
     * Shows a Text on the Snackbar.
     *
     * @param {string} text
     */
    public static showTextOnSnackbar( text: string ) {
        const snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        snackbar.innerHTML = text;

        setTimeout(() => {
            snackbar.className = snackbar.className.replace("show", "");
        }, 2000);
    }

    public render(): any {
        return <div className={"app"}>
            <div id={"header"}>
                <Header />
            </div>
            <div id={"body"}>
                <Route path={Routes.APP_DEF} exact={true} component={LoginView} />
                <Route path={Routes.LOGIN_DEF} component={LoginView} />
                <Route path={Routes.LOBBY_DEF} component={LobbyView} />
                <Route path={Routes.GAME_DEF} component={RoomView} />
                <Route path={Routes.GAME_STATS_DEF} component={RoomStatsView} />
            </div>
            <div id="snackbar"/>
            <div id={"footer"}>
                <Footer/>
            </div>
        </div>;
    }
}
