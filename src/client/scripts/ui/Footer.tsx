import * as React from "react";

export interface IFooterProps {
}

export interface IFooterState {
}

export class Footer extends React.Component<IFooterProps, IFooterState> {

    public render(): any {

        return <div className={"footer"}>
            <div className={"footerA"}>
                Ein Projekt im Rahmen des Wahlpflichtmoduls Moderne Browserkommunikation.
            </div>
            <div className={"footerB"}>
                Projektteilnehmer: Marco Köpcke, Tim Beier, Robin Müller, Alexander Matthiesen
            </div>
        </div>;
    }
}
