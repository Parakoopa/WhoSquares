import * as React from "react";

export interface IHeaderProps {
}

export interface IHeaderState {

}

export class Header extends React.Component<IHeaderProps, IHeaderState> {

    public render(): any {
        return <div id="header">
            <h1> WHO SQUARES! </h1>
        </div>;
    }
}
