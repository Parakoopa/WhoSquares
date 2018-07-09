import * as React from "react";
import {Connection} from "../../../Connection";

export interface IGeneralStatsProps {
}

export interface IGeneralStatsState {
    stats: IGlobalStatsResponse;
    loaded: boolean;
}

export class GeneralStats extends React.Component<IGeneralStatsProps, IGeneralStatsState> {

    constructor(props: Readonly<IGeneralStatsProps>) {
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

        Connection._socket.emit("globalStats", {} as IGlobalStatsRequest);

        Connection._socket.once("globalStats", (resp: IGlobalStatsResponse) => {
            this.setState({
                loaded: true,
                stats: resp
            });
        });

    }

    public render() {
        if (this.state.loaded) {
            return <div className="global-stats">
                <h3>Global Statistics:</h3>
                <table className={"statsTable"}>
                    <tbody>
                        <tr>
                            <th>Games Played:</th>
                            <td>{this.state.stats.gamesPlayed}</td>
                        </tr>
                        <tr>
                            <th>Tiles Placed:</th>
                            <td>{this.state.stats.tilesPlaced}</td>
                        </tr>
                    </tbody>
                </table>
            </div>;
        } else {
            return <div />;
        }
    }
}
