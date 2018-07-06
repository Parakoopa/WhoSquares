import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Connection} from "../../Connection";
import {GameManager} from "../../game/GameManager";
import {OtherPlayer} from "../../game/OtherPlayer";
import {Game} from "../components/room/Game";
import {GameAlerts} from "../components/room/GameAlerts";
import {GameControl} from "../components/room/GameControl";
import {PlayerList} from "../components/room/PlayerList";
import {RoomInfo} from "../components/room/RoomInfo";
import {TurnInfo} from "../components/room/TurnInfo";
import {WinnerInfo} from "../components/room/WinnerInfo";
import {IRoomUI} from "../interfaces/IRoomUI";
import {Routes} from "../Routes";

export interface IRoomViewProps extends RouteComponentProps<IRoomViewProps> {
    roomid: string;
    username: string;
}

export interface IRoomViewState {
    players: OtherPlayer[];
    activePlayer: IPlayer;
    gameInfo: string;
    winner: IPlayer;
    gameManager: GameManager;
}

export class RoomView extends React.Component<IRoomViewProps, IRoomViewState> implements IRoomUI {

    constructor(props: IRoomViewProps) {
        super(props);

        this.leaveRoom = this.leaveRoom.bind(this);
        this.startGame = this.startGame.bind(this);
        this.updatePlayerlist = this.updatePlayerlist.bind(this);
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.updateWinner = this.updateWinner.bind(this);

        this.state = {
            players: [],
            activePlayer: null,
            gameInfo: "",
            winner: null,
            gameManager: null
        };

        Connection.setRoomname(this.props.roomid);
    }

    public getUsername() {
        return this.props.username;
    }

    public getRoomID() {
        return this.props.roomid;
    }

    public leaveRoom() {
        if (this.state.gameManager !== null)
            this.state.gameManager.actionLeaveRoom();
    }

    public updatePlayerlist(players: OtherPlayer[]) {
        this.setState({players});
    }

    public updateTurnInfo(activePlayer: IPlayer): void {
        this.setState({activePlayer});
    }

    public updateGameInfo(gameInfo: string): void {
        this.setState({gameInfo});
    }

    public updateWinner(winner: IPlayer): void {
        this.setState({winner});
    }

    public updateMission(mission: IMission): void {
    }

    public startGame() {
        if (this.state.gameManager !== null)
            this.state.gameManager.actionStartGame();
    }

    public leftRoom() {
        window.location.href = Routes.linkToLobbyHREF();
    }

    public roomMessage(player: IPlayer, message: string): void {
        console.log(player + ": " + message);
        // ToDo Update Chat Window
    }

    public componentDidMount(): void {
        Connection.getSocket((socket: SocketIOClient.Socket) => {
            console.log("New Manager!");
            this.setState({gameManager: new GameManager(socket, this)});
        });
    }

    public render() {
        return <div className={"content"}>
            <Game/>
            <GameControl actionStartGame={this.startGame} actionLeaveRoom={this.leaveRoom}/>
            <div className={"info"}>
                <RoomInfo roomid={this.props.roomid}/>
                <WinnerInfo winner={this.state.winner}/>
                <PlayerList players={this.state.players}/>
                <TurnInfo player={this.state.activePlayer}/>
                <GameAlerts alert={this.state.gameInfo}/>
            </div>
        </div>;
    }
}
