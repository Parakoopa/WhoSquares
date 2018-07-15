import * as React from "react";

export interface IRoomListProps {
    roomlist: IRoomListResponse;
    actionJoinRoom: (name: string) => void;
    actionStatsRoom: (name: string) => void;
}

export interface IRoomListState {
}

/**
 * Defines a RoomList-Component.
 */
export class RoomList extends React.Component<IRoomListProps, IRoomListState> {

    public render(): any {
        // If something is missing -> No Rooms!
        if (!this.props.roomlist || !this.props.roomlist.rooms || this.props.roomlist.rooms.length === 0)
            return <h2>No rooms...</h2>;

        // Maps the Roomnames to individual Buttons
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
