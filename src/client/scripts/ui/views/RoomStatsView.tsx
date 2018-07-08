import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {RoomInfo} from "../components/room/RoomInfo";
import {RoomStatsUsers} from "../components/room-stats/RoomStatsUsers";
import {RoomStatsGeneral} from "../components/room-stats/RoomStatsGeneral";
import {Routes} from "../Routes";
import {RoomStatsReplay} from "../components/room-stats/RoomStatsReplay";
import {Connection} from "../../Connection";

export interface IRoomStatsViewProps extends RouteComponentProps<IRoomStatsViewProps> {
    roomid: string;
    username: string;
}

export interface IRoomStatsViewState {
    stats: IRoomStatsResponse;
    loaded: boolean;
}

export class RoomStatsView extends React.Component<IRoomStatsViewProps, IRoomStatsViewState> {

    constructor(props: Readonly<IRoomStatsViewProps>) {
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

        Connection._socket.emit("roomStats", {roomKey: this.props.match.params.roomid} as IRoomStatsRequest);

        Connection._socket.once("roomStats", (resp: IRoomStatsResponse) => {
            if (!resp.stats) {
                // TODO error handling
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
            return <div>
                <div className={"content"}>
                    <button className={"button"} onClick={this.backToLobby}>Back to Lobby</button>
                    <RoomInfo roomid={this.props.match.params.roomid}/>
                    <h2>Statistics</h2>
                </div>
                <RoomStatsUsers playerStats={this.state.stats.stats.players}/>
                <RoomStatsGeneral generalStats={this.state.stats.stats.general}/>
                <RoomStatsReplay stats={this.state.stats.stats} replay={this.state.stats.replay}/>
            </div>;
        } else {
            return <div>
                <div className={"content"}>
                    <button className={"button"} onClick={this.backToLobby}>Back to Lobby</button>
                    <RoomInfo roomid={this.props.match.params.roomid}/>
                    <h2>Loading...</h2>
                </div>
            </div>;
        }
    }

    private backToLobby() {
        window.location.href = Routes.linkToLobbyHREF();
    }
}
