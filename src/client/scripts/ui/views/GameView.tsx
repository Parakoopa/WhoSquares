import * as React from "react";
import {Link, RouteComponentProps} from "react-router-dom";
import {GameWrapper} from "../components/GameWrapper";

export interface IGameViewProps {
    roomid: string;

}

export interface IGameViewState {

}

export class GameView extends React.Component<IGameViewProps & RouteComponentProps<IGameViewProps>, IGameViewState> {

    public render() {
        const roomid = this.props.match.params.roomid;

        return <div>
            {/* Die Game(View) Komponente lädt aktuell einfach den aktuellen Spiel-Canvas. Später muss man der wohl
                noch beibringen zbs. welcher Raum betreten werden soll? Das würde ich dann hier
                als Prop mitgeben: */}
            <GameWrapper roomid={roomid}/>
        </div>;
    }
}
