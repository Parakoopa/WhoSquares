import * as React from "react";
import {GameManager} from "../../game/GameManager";
import {OtherPlayer} from "../../game/OtherPlayer";
import {IUserInterface} from "../IUserInterface";
import {Routes} from "../Routes";

export interface IRoomProps {
    roomid: string;
    username: string;
}

export interface IRoomState {
    players: OtherPlayer[];
    activePlayer: IPlayer;
    gameInfo: string;
    winner: IPlayer;
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
            winner: null
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
        this.gameManager = new GameManager(this);
    }

    public render() {
        const playerlist = this.state.players.map((player) =>
            <li>{player.name}</li>
        );

        const styleTurnInfo = {
            backgroundColor: this.getActivePlayerColorHtml()
        };

        const divStyle = {
            "width": "100%",
            "text-align": "center",
            "vertical-align": "center",
            "font-size": "1.25em",
            "margin-bottom": "3em",
        };

        const buttonStyle = {
            "display": "block",
            "margin": "0 auto",
            "width": "fit-content",
            "margin-top": "1em",
            "backgroundColor": "#162856",
            "border": "3px solid #7887AB",
            "padding": "0.25em 1em",
            "font-size": "0.75em",
            "color": "White",
            "alignment": "center",
        };

        const gameStyle = {
            "width": "250px",
            "height": "250px",
            "alignment": "center",
            "margin": "0 auto",
        };

        return <div style={divStyle}>
            <div>
                <label>RoomID: {this.props.roomid}</label>
            </div>
            <div>
                <label>Winner: {this.getWinnerName()}</label>
            </div>
            <div>
                <label>Players: </label>
                {playerlist}
            </div>
            <div>
                <label>TurnInfo: </label>
                <label style={styleTurnInfo}>
                    {this.getActivePlayerName()}
                </label>
            </div>
            <div>
                <button onClick={this.startGame}>Start Game</button>
            </div>
            <div>
                <label>GameInfo: {this.state.gameInfo}</label>
            </div>
            <div id="game" style={gameStyle}/>
            <button style={buttonStyle} onClick={this.leaveRoom}>Leave Room</button>
        </div>;
    }
}
