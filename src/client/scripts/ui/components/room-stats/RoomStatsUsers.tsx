import * as React from "react";
import {Missions} from "../../../../../common/scripts/Missions/Missions";

export interface IRoomStatsUsersProps {
    playerStats: IRoomStatsPlayer[];
}

export interface IRoomStatsUsersState {
}

export class RoomStatsUsers extends React.Component<IRoomStatsUsersProps, IRoomStatsUsersState> {
    public render() {
        // Put winner on top
        this.props.playerStats.sort((a, b) => a.winner ? -1 : 0);
        const list = [
            <tr>
                <th>Player</th>
                <th /> {/* Winner icon */}
                <th colSpan={3}>Mission</th>
                <th>Tiles Placed</th>
                <th>Coverage %</th>
            </tr>
        ];
        this.props.playerStats.forEach((stats) => {
            let winnerTile = <td />
            if (stats.winner) {
                winnerTile = <td>Winner!</td>;
            }
            const mission = Missions.getMission(stats.missionName);
            list.push(
               <tr className={stats.winner ? "player-row winner" : "player-row"}>
                   <td><span color={"#" + stats.base.color.toString(16)}>{stats.base.name}</span></td>
                   {winnerTile}
                   <td><img style={{width: "50px"}} src={mission.imgpath()} /></td>
                   <td>{mission.name()}</td>
                   <td>{mission.description()}</td>
                   <td>{stats.tilesPlaced}</td>
                   <td>{Math.round(stats.coverage * 100)}%</td>
               </tr>
            );
        });
        return <table>
            <tbody>
                {list}
            </tbody>
        </table>;
    }
}
