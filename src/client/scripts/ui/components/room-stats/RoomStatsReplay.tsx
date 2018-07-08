import * as React from "react";
import {Game} from "../room/Game";
import {ChatMessages} from "../room/ChatMessages";

export interface IRoomStatsReplayProps {
    stats: IRoomStats;
    replay: IReplayLogEntry[];
}

export interface IRoomStatsReplayState {
}

// TODO: Replay with real chat and game view
export class RoomStatsReplay extends React.Component<IRoomStatsReplayProps, IRoomStatsReplayState> {
    public render() {
        const rows = [
            <tr>
                <th />
                <th>Event</th>
            </tr>,
            <tr>
                <td />
                <td>The Game was started.</td>
            </tr>
        ];
        this.props.replay.forEach((entry => {
            let concrete;
            switch (entry.type) {
                case "tilePlaced":
                    concrete = entry as ILogTilePlaced;
                    rows.push(
                        <tr>
                            <td>{concrete.turnNo}</td>
                            <td>{concrete.player.name} placed a tile at {concrete.x},{concrete.y}.</td>
                        </tr>
                    );
                    break;
                case "joined":
                    concrete = entry as ILogJoined;
                    rows.push(
                        <tr>
                            <td />
                            <td>{concrete.player.name} joined as spectator.</td>
                        </tr>
                    );
                    break;
                case "left":
                    concrete = entry as ILogLeft;
                    rows.push(
                        <tr>
                            <td />
                            <td>{concrete.player.name} left.</td>
                        </tr>
                    );
                    break;
                case "winner":
                    concrete = entry as ILogWinner;
                    rows.push(
                        <tr>
                            <td />
                            <td>{concrete.player.name} won the game.</td>
                        </tr>
                    );
                    break;
                case "chat":
                    concrete = entry as ILogChatMessage;
                    rows.push(
                        <tr>
                            <td />
                            {/* TODO: Possible injection */}
                            <td>{concrete.player.name} wrote:<br /><i>{concrete.message}</i></td>
                        </tr>
                    );
                    break;
            }
        }));
        return <div className={"replay-room"}>
            <h3>Replay</h3>
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>;
    }
}