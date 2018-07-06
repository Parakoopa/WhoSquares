import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Connection} from "../../Connection";
import {Login} from "../../game/components/Login";
import {OtherPlayer} from "../../game/OtherPlayer";
import {ChatInput} from "../components/room/ChatInput";
import {ChatMessage} from "../components/room/ChatMessage";
import {ChatMessages} from "../components/room/ChatMessages";
import {Game} from "../components/room/Game";
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
    winner: IPlayer;
    login: Login;
    messages: ChatMessage[];
}

export class RoomView extends React.Component<IRoomViewProps, IRoomViewState> implements IRoomUI {
    // ToDo create Room

    constructor(props: IRoomViewProps) {
        super(props);

        this.state = {
            players: [],
            activePlayer: null,
            winner: null,
            login: null,
            messages: []
        };

        this.leaveRoom = this.leaveRoom.bind(this);
        this.startGame = this.startGame.bind(this);
        this.updatePlayerList = this.updatePlayerList.bind(this);
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.updateWinner = this.updateWinner.bind(this);
        this.sendRoomMessage = this.sendRoomMessage.bind(this);

        Connection.setRoomname(this.props.roomid);
    }

    public getUsername() {
        return this.props.username;
    }

    public getRoomID() {
        return this.props.roomid;
    }

    public leaveRoom() {
        if (this.state.login !== null)
            this.state.login.actionLeaveRoom(); // ToDo now part of lobby (lobbyView is responsible)?
    }

    public updatePlayerList(players: OtherPlayer[]) {
        this.setState({players});
    }

    public updateTurnInfo(activePlayer: IPlayer): void {
        this.setState({activePlayer});
    }

    public updateGameInfo(gameInfo: string): void {
        const snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        snackbar.innerHTML = gameInfo;

        setTimeout(() => {
            snackbar.className = snackbar.className.replace("show", "");
        }, 2000);
    }

    public updateWinner(winner: IPlayer): void {
        this.setState({winner});
    }

    public updateMission(mission: IMission): void {
    }

    public startGame() {
        if (this.state.login)
            this.state.login.actionStartGame(); // ToDo now part of room
    }

    public leftRoom() {
        window.location.href = Routes.linkToLobbyHREF();
    }

    public roomMessage(player: IPlayer, message: string): void {
        const messages = this.state.messages;

        messages.push(new ChatMessage({player, message}));

        this.setState({messages});
    }

    public sendRoomMessage(text: string) {
        console.log("Send text:" + text + " | " + this.state);

        if (this.state.login)
            this.state.login.actionSendRoomMessage(text); // ToDo now part of room
    }

    public componentDidMount(): void {
        Connection.getSocket((socket: SocketIOClient.Socket) => {
            console.log("New Manager!");
            this.setState({login: new Login(socket, this)}); // ToDo now needs socket to create RequestEmitter
        });
    }

    public render() {
        return (
            <div className={"content"}>
                <Game/>
                <GameControl actionStartGame={this.startGame} actionLeaveRoom={this.leaveRoom}/>
                <div className={"info"}>
                    <RoomInfo roomid={this.props.roomid}/>
                    <WinnerInfo winner={this.state.winner}/>
                    <PlayerList players={this.state.players}/>
                    <TurnInfo player={this.state.activePlayer}/>
                    <div>
                        <h3>Chat</h3>
                        <ChatMessages messages={this.state.messages}/>
                        <ChatInput onSend={this.sendRoomMessage}/>
                    </div>
                </div>
                <div id="snackbar"/>
            </div>
        );
    }
}
