import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

export interface IRoomStatsViewProps extends RouteComponentProps<IRoomStatsViewProps> {
    roomid: string;
    username: string;
}

export interface IRoomStatsViewState {
}

export class RoomStatsView extends React.Component<IRoomStatsViewProps, IRoomStatsViewState> {
    public render() {
        return <div></div>;
    }
}
