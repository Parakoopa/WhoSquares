import * as React from "react";

export interface IRoomInfoProps {
    roomid: string;
}

export interface IRoomInfoState {
}

export class RoomInfo extends React.Component<IRoomInfoProps, IRoomInfoState> {

    public render(): any {
        return <div><label>Current Room: {this.props.roomid}</label></div>;
    }
}
