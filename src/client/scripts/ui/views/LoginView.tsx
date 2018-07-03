import * as React from "react";
import {Login} from "../components/Login";

export interface ILoginViewProps {

}
export interface ILoginViewState {

}

export class LoginView extends React.Component<ILoginViewProps, ILoginViewState> {
    public render() {

        return <div className={"view"}>
            {/* Die Game(View) Komponente lädt aktuell einfach den aktuellen Spiel-Canvas. Später muss man der wohl
                noch beibringen zbs. welcher Raum betreten werden soll? Das würde ich dann hier
                als Prop mitgeben: */}
            <Login/>
        </div>;
    }
}
