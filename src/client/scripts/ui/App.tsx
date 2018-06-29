import * as React from "react";
import {Link} from "react-router-dom";
import {Route} from "react-router";
import {GameView} from "./views/GameView";

export interface IAppProps {
    name: string;
}
export interface IAppState {

}

export class App extends React.Component<IAppProps, IAppState> {
    public render(): any {
        return <div>
            <h1>Hello, {this.props.name}</h1>
            <Link to="/game">Zum Spiel</Link>
            <div id="views">
                {/* Hier drin werden die Views gerendert */}
                <Route path="/game" component={GameView}/>
            </div>
        </div>;
    }
}
