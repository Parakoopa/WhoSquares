import * as React from "react";
import {transform} from "typescript";

export interface IHeaderProps {
}

export interface IHeaderState {

}

export class Header extends React.Component<IHeaderProps, IHeaderState> {

    public render(): any {

        return <div className={"header"} id="header">
            <a href="https://www.w3schools.com">
            <img alt="W3Schools" src="../../img/startButton.png" width="40em" height="40em" />
            </a>
            <h1 className={"title"}> Who Squares? </h1>
        </div>;
    }
}
