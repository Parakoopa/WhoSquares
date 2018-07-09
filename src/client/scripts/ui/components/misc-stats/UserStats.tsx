import * as React from "react";
import {Connection} from "../../../Connection";

export interface IUserStatsProps {
    playerKey: string;
}

export interface IUserStatsState {
    stats: IUserStatsResponse;
    loaded: boolean;
}

export class UserStats extends React.Component<IUserStatsProps, IUserStatsState> {

    constructor(props: Readonly<IUserStatsProps>) {
        super(props);
        this.state = {
            stats: null,
            loaded: false
        };
    }

    public componentDidMount() {
        this.setState({
            loaded: false
        });

        Connection.initSocket();

        Connection._socket.emit("userStats", {playerKey: this.props.playerKey} as IUserStatsRequest);

        Connection._socket.once("userStats", (resp: IUserStatsResponse) => {
            if (!resp.userName) {
                // TODO: Better error handling
                return;
            }
            this.setState({
                loaded: true,
                stats: resp
            });
        });

    }

    public render() {
        if (this.state.loaded) {
            return <div className="global-stats">
                <h3>Statistics for {this.state.stats.userName}:</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>Games Played:</th>
                            <td>{this.state.stats.gamesPlayed.total}</td>
                        </tr>
                        <tr>
                            <th>Games Won:</th>
                            <td>{this.state.stats.gamesPlayed.won}</td>
                        </tr>
                        <tr>
                            <th>Tiles Placed:</th>
                            <td>{this.state.stats.tilesPlaced}</td>
                        </tr>
                    </tbody>
                </table>
            </div>;
        } else {
            return <div/>;
        }
    }
}
