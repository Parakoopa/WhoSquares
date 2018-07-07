import * as React from "react";

export interface IGameAlertsProps {
    alert: string;
}

export interface IGameAlertsState {
}

export class GameAlerts extends React.Component<IGameAlertsProps, IGameAlertsState> {

    public render(): any {
        return <div><label>{this.props.alert}</label></div>;
    }
}
