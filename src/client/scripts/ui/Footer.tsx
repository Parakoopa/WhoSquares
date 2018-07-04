import * as React from "react";

export interface IFooterProps {
}

export interface IFooterState {
}

export class Footer extends React.Component<IFooterProps, IFooterState> {

    public render(): any {

        return <div className={"footer"} id="footer">
            Footer
        </div>;
    }
}
