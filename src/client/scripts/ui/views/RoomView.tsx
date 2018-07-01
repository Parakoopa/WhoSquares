import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Room} from "../components/Room";

export interface IRoomViewProps extends RouteComponentProps<IRoomViewProps> {
    roomid: string;
    username: string;
}

export interface IRoomViewState {

}

export class RoomView extends React.Component<IRoomViewProps, IRoomViewState> {

    public render() {
        const roomid = this.props.match.params.roomid;
        const username = this.props.match.params.username;

        return <div>
            <Room roomid={roomid} username={username}/>
        </div>;
    }
}
