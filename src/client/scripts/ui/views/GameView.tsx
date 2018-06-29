import * as React from "react";
import {Link} from "react-router-dom";
import {Game} from "../components/Game";

export interface IGameViewProps {

}
export interface IGameViewState {

}

export class GameView extends React.Component<IGameViewProps, IGameViewState> {
    public render() {
        return <div>
            <h2>GameView!</h2>
            <Link to="/">Zurück / Schließen</Link>
            {/* Die Game(View) Komponente lädt aktuell einfach den aktuellen Spiel-Canvas. Später muss man der wohl
                noch beibringen zbs. welcher Raum betreten werden soll? Das würde ich dann hier
                als Prop mitgeben: */}
            <Game />
        </div>;
    }
}
