import * as React from "react";

export interface IRoomListProps {
    roomlist: string[];
    actionJoinRoom: (name: string) => void;
}

export interface IRoomListState {
}

export class RoomList extends React.Component<IRoomListProps, IRoomListState> {

    public render(): any {
        if (!this.props.roomlist || this.props.roomlist.length === 0)
            return <h2>No rooms...</h2>;

        const list = this.props.roomlist.map((name, i) =>
            <div key={i}>
                <button className={"button"} onClick={() => {
                    this.props.actionJoinRoom(name);
                }}>{name}</button>
            </div>
        );

        return <div>{list}</div>;
    }
}
