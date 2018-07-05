import * as React from "react";
import {GameManager} from "../../game/GameManager";
import {OtherPlayer} from "../../game/OtherPlayer";
import {IUserInterface} from "../IUserInterface";
import {Routes} from "../Routes";
import {App} from "../App";
import {Connection} from "../../Connection";

export interface IRoomProps {
    roomid: string;
    username: string;
}

export interface IRoomState {
    players: OtherPlayer[];
    activePlayer: IPlayer;
    gameInfo: string;
    winner: IPlayer;
    gameManager: GameManager;
}

export class Room extends React.Component<IRoomProps, IRoomState> implements IUserInterface {

    constructor(props: IRoomProps) {
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

    public getActivePlayerColorHtml(): string {
        let color;
        if (this.state.activePlayer == null)
            color = 0;
        else
            color = this.state.activePlayer.color;

        return "#" + color.toString(16);
    }

    public getActivePlayerName(): string {
        if (this.state.activePlayer == null)
            return "";
        else
            return this.state.activePlayer.name;
    }

    public getWinnerName(): string {
        if (this.state.winner == null)
            return "";
        else
            return this.state.winner.name;
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
        const playerlist = this.state.players.map((player, i) =>
            <li key={i}>{player.name}</li>
        );

        const styleTurnInfo = {
            color: this.getActivePlayerColorHtml(),
            fontWeight: 900,
        };

        return <div className={"content"}>
            <div id="game" className={"game"}/>
            <div id={"buttons"}>
                <button className={"button"} onClick={this.startGame}>
                    Start Game
                </button>
                <button className={"button"} onClick={this.leaveRoom}>
                    Leave Room
                </button>
            </div>
            <div className={"info"}>
                <div>
                    <label>Current Room: {this.props.roomid}</label>
                </div>
                <div>
                    <label>Winner: {this.getWinnerName()}</label>
                </div>
                <div>
                    <label>Players: </label>
                    {playerlist}
                </div>
                <br/>
                <div>
                    <label>Turn Info: </label>
                    <label style={styleTurnInfo}>
                        {this.getActivePlayerName()}
                    </label>
                </div>
                <div>
                    <label>Game Info: {this.state.gameInfo}</label>
                </div>
            </div>
        </div>;
    }
}
