import * as React from "react";
import {Game} from "./Game";

export interface IAppProps {
    name: string;
}
export interface IAppState {

}

export class App extends React.Component<IAppProps, IAppState> {
    public render() {
        return <div>
            <h1>Hello, {this.props.name}</h1>
            {/* Die Game Komponente lädt aktuell einfach den aktuellen Spiel-Canvas. Später muss man der wohl
                noch beibringen zbs. welcher Raum betreten werden soll? Das würde ich dann hier
                als Prop mitgeben: */}
            <Game />
        </div>;
    }
}
