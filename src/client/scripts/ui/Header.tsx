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
            <img alt="Who Squares?" src="../../img/header.png" width="500em" height="140em" />
            </a>
        </div>;
    }
}
