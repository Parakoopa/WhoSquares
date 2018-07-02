import * as React from "react";

export interface IFooterProps {
}

export interface IFooterState {
}

export class Footer extends React.Component<IFooterProps, IFooterState> {

    public render(): any {

        const style = {
            "display": "flex",
            "flex-direction": "row",
            "align-items": "center",
            "margin-top": "1em"
        };

        return <div id="footer" style={style}>
            Footer
        </div>;
    }
}
