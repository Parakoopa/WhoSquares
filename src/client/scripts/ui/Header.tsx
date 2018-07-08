import * as React from "react";
import {LogoutButton} from "./components/header/LogoutButton";

export interface IHeaderProps {
}

export interface IHeaderState {

}

export class Header extends React.Component<IHeaderProps, IHeaderState> {
    public render(): any {

        return <div className={"header"} id="header">
            <a href="https://gitlab.informatik.haw-hamburg.de/wp-mbc-ss2018/who-squares">
                <img alt="Who Squares?" src="../../img/header.png" width="500em" height="140em"/>
            </a>
        </div>;
    }
}
