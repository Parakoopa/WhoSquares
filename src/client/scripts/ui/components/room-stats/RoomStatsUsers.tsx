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
        this.props.playerStats.sort((a, b) =>
            a.winner ?
                -1 :
                b.winner ?
                    1 :
                    b.tilesPlaced - a.tilesPlaced
        );
        const list = [
            <tr key={"head"}>
                <th>Player</th>
                <th colSpan={3}>Mission</th>
                <th>Tiles&nbsp;Placed</th>
                <th>Coverage&nbsp;%</th>
            </tr>
        ];
        this.props.playerStats.forEach((stats, i) => {
            const crown = stats.winner ?
                        <img className={"winnerIcon"} src="../../../../img/icons/Winner_True.png"
                             width={"20em"} height={"20em"} /> :
                        <img className={"winnerIcon"} src="../../../../img/icons/Winner_False.png"
                             width={"20em"} height={"20em"} />;
            const mission = Missions.getMission(stats.missionName);
            list.push(
               <tr key={i} className={stats.winner ? "player-row winner" : "player-row"}>
                   <td>{crown}<span color={"#" + stats.base.color.toString(16)}>{stats.base.name}</span></td>
                   <td><img style={{width: "50px"}} src={mission.imgpath()} /></td>
                   <td>{mission.name()}</td>
                   <td>{mission.description()}</td>
                   <td>{stats.tilesPlaced}</td>
                   <td>{Math.round(stats.coverage * 100)}%</td>
               </tr>
            );
        });
        return <div>
            <h3>Players</h3>
            <table className={"statsTable"}>
                <tbody>
                {list}
                </tbody>
            </table>
        </div>;
    }
}
