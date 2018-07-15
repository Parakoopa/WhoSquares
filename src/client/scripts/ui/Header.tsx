import * as React from "react";

export interface IHeaderProps {
}

export interface IHeaderState {

}

/**
 * Defines the Header-Component.
 */
export class Header extends React.Component<IHeaderProps, IHeaderState> {
    public render(): any {

        return <div className={"header"} id="header">
            <img alt="Who Squares?" src="../../img/header.png" width="500em" height="140em"/>
        </div>;
    }
}
