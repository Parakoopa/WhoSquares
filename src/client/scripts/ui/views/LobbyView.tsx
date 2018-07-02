import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Lobby} from "../components/Lobby";

export interface ILobbyViewProps extends RouteComponentProps<ILobbyViewProps> {
    username: string;
}
export interface ILobbyViewState {

}

export class LobbyView extends React.Component<ILobbyViewProps, ILobbyViewState> {
    public render() {
        const username = this.props.match.params.username;

        const divStyle = {
            "width": "fit-content",
            "text-align": "center",
        };


        return <div style={divStyle}>
            {/* Die Game(View) Komponente lädt aktuell einfach den aktuellen Spiel-Canvas. Später muss man der wohl
                noch beibringen zbs. welcher Raum betreten werden soll? Das würde ich dann hier
                als Prop mitgeben: */}
            <Lobby username={username}/>
        </div>;
    }
}
