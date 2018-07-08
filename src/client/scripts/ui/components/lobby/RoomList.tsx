import * as React from "react";
import {ILoginViewProps} from "../../views/LoginView";

export interface IRoomListProps {
    roomlist: IRoomListResponse;
    actionJoinRoom: (name: string) => void;
    actionStatsRoom: (name: string) => void;
}

export interface IRoomListState {
}

export class RoomList extends React.Component<IRoomListProps, IRoomListState> {

    public render(): any {
        if (!this.props.roomlist || !this.props.roomlist.rooms || this.props.roomlist.rooms.length === 0)
            return <h2>No rooms...</h2>;

        const list = this.props.roomlist.rooms.map((room, i) => {
            if (!room.ended) {
                return <div key={i}>
                    <button className={"button"} onClick={() => {
                        this.props.actionJoinRoom(room.name);
                    }}>{room.name}</button>
                </div>;
            } else {
                return <div key={i}>
                    <button className={"button gray"} onClick={() => {
                        this.props.actionStatsRoom(room.name);
                    }}>{room.name}</button>
                </div>;
            }
        });

        return <div>{list}</div>;
    }
}
