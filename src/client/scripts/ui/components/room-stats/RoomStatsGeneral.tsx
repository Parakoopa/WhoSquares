import * as React from "react";

export interface IRoomStatsGeneralProps {
    generalStats: {
        coverage: number; // 0 - 1
        tilesPlaced: number;
        numberTurns: number;
    };
}

export interface IRoomStatsGeneralState {
}

export class RoomStatsGeneral extends React.Component<IRoomStatsGeneralProps, IRoomStatsGeneralState> {
    public render() {
        return <table>
            <tbody>
                <tr>
                    <th colSpan={2}><h4>Overall statistics</h4></th>
                </tr>
                <tr>
                    <th>Tiles Placed:</th>
                    <td>{this.props.generalStats.tilesPlaced}</td>
                </tr>
                <tr>
                    <th>Coverage %:</th>
                    <td>{Math.round(this.props.generalStats.coverage * 100)}%</td>
                </tr>
                <tr>
                    <th>Number of Turns:</th>
                    <td>{this.props.generalStats.numberTurns}</td>
                </tr>
            </tbody>
        </table>;
    }
}
