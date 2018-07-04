import * as React from "react";
import {GameManager} from "../../game/GameManager";
import {OtherPlayer} from "../../game/OtherPlayer";
import {IUserInterface} from "../IUserInterface";
import {Routes} from "../Routes";
import {App} from "../App";

export interface IRoomProps {
    roomid: string;
    username: string;
}

export interface IRoomState {
    players: OtherPlayer[];
    activePlayer: IPlayer;
    gameInfo: string;
    winner: IPlayer;
    mission: IMission;
}

export class Room extends React.Component<IRoomProps, IRoomState> implements IUserInterface {

    private gameManager: GameManager;

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
            mission: null
        };
    }

    public getUsername() {
        return this.props.username;
    }

    public getRoomID() {
        return this.props.roomid;
    }

    public leaveRoom() {
        if (this.gameManager !== undefined)
            this.gameManager.actionLeaveRoom();
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

    public updateMission(mission: IMission): void {
        this.setState({mission});
    }

    public updateWinner(winner: IPlayer): void {
        this.setState({winner});
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

    public getMissionName(): string {
        if (this.state.mission == null)
            return "";
        else
            return this.state.mission.name();
    }

    public getMissionDesc(): string {
        if (this.state.mission == null)
            return "";
        else
            return this.state.mission.description();
    }

    public getMissionImgPath(): string {
        if (this.state.mission == null)
            return "";
        else
            return this.state.mission.imgpath();
    }

    public startGame() {
        if (this.gameManager !== undefined)
            this.gameManager.actionStartGame();
    }

    public leftRoom() {
        window.location.href = Routes.linkToLobbyHREF(this.props.username);
    }

    public roomMessage(player: IPlayer, message: string): void {
        console.log(player + ": " + message);
        // ToDo Update Chat Window
    }

    public joinLobby(rooms: string[]): void {
        console.log("rooms" + ": ");
        for (const room of rooms) {
            console.log(room);
        }
        // ToDo Display room list to user
    }

    public componentDidMount(): void {
        // Init game
        this.gameManager = new GameManager(App._socket, this);
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
                <button className={"button"} onClick={this.startGame}>Start Game</button>
                <button className={"button"} onClick={this.leaveRoom}>Leave Room</button>
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
                <div>
                    <label>Mission: {this.getMissionName()}</label>
                </div>
                <div>
                    <label>{this.getMissionDesc()}</label>
                </div>
                <div>
                    <img src={this.getMissionImgPath()}/>
                </div>
            </div>
        </div>;
    }
}
