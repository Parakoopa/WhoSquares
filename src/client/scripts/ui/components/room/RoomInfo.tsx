import * as React from "react";

export interface IRoomInfoProps {
    roomid: string;
}

export interface IRoomInfoState {
}

export class RoomInfo extends React.Component<IRoomInfoProps, IRoomInfoState> {

    public render(): any {
        return <div><h3>{this.props.roomid}</h3></div>;
    }
}
