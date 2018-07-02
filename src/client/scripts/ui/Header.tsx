import * as React from "react";
import {transform} from "typescript";

export interface IHeaderProps {
}

export interface IHeaderState {

}

export class Header extends React.Component<IHeaderProps, IHeaderState> {

    public render(): any {

        const headerStyle = {
            "display": "flex",
            "flex-direction": "row",
            "align-items": "center",
        };

        const hStyle = {
            "width": "fit-content",
            "margin-left": "1em",
        };

        return <div style={headerStyle} id="header">
            <a href="https://www.w3schools.com">
            <img alt="W3Schools" src="../../img/startButton.png" width="40em" height="40em" />
            </a>
            <span><h1 style={hStyle}> Who Squares? </h1></span>
        </div>;
    }
}
