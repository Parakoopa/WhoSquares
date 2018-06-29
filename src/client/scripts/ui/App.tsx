import * as React from "react";
import {Redirect, Route} from "react-router";
import {Link} from "react-router-dom";
import {GameView} from "./views/GameView";
import {LobbyView} from "./views/LobbyView";

export interface IAppProps {
    name: string;
}

export interface IAppState {

}

export class App extends React.Component<IAppProps, IAppState> {
    public render(): any {
        return <div>
            <h1>Hello, {this.props.name}</h1>
            <Link to="/lobby">Zur Lobby</Link>
            <div id="views">
                {/* Hier drin werden die Views gerendert */}
                <Route path="/lobby" component={LobbyView}/>
                <Route path="/game/:roomid" component={GameView}/>
            </div>
        </div>;
    }
}