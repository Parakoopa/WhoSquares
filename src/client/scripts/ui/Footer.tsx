import * as React from "react";
import {LogoutButton} from "./components/header/LogoutButton";

export interface IFooterProps {
}

export interface IFooterState {
}

export class Footer extends React.Component<IFooterProps, IFooterState> {

    public render(): any {
        const onLogin = !window.location.href.includes("lobby")
            && !window.location.href.includes("game");

        return <div>
            {!onLogin && <LogoutButton/>}
            <div className={"footer"}>
                <div className={"footerA"}>
                    Ein Projekt im Rahmen des Wahlpflichtmoduls Moderne Browserkommunikation.
                </div>
                <div className={"footerB"}>
                    Projektteilnehmer: Marco Köpcke, Tim Beier, Robin Müller, Alexander Matthiesen
                </div>
            </div>
        </div>;
    }
}
