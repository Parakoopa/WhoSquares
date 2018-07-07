import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Connection} from "../../Connection";
import {Login} from "../../game/components/Login";
import {Room} from "../../game/components/Room";
import {OtherPlayer} from "../../game/OtherPlayer";
import {Utility} from "../../game/Utility";
import {App} from "../App";
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
    room_backend: Room;
}

export class RoomView extends React.Component<IRoomViewProps, IRoomViewState> implements IRoomUI {

    constructor(props: IRoomViewProps) {
        super(props);

        Connection.initSocket();

        if (!Connection.getKey() || !Connection.getUsername()) {
            window.location.href = Routes.linkToLoginHREF();
            return;
        }

        const color = parseInt("FF33FF", 16);
        const name = Connection.getUsername();
        const isObserver = true;

        Utility.addLocalPlayer(
            {name, color, isObserver},
            Connection.getKey(),
            Connection.getSocket()
        );

        Room.actionJoinRoom( this.props.roomid );

        Connection._socket.once( "joinedRoom", (resp: IJoinedResponse) => {
            const room_backend = new Room(
                resp.roomKey,
                resp.roomName,
                Utility.getLocalPlayer(),
                resp.otherPlayers,
                this,
                resp.gridInfo
            );

            this.setState( {room_backend} );
        });

        this.state = {
            players: [],
            activePlayer: null,
            winner: null,
            login: null,
            messages: [],
            room_backend: null
        };

        this.leaveRoom = this.leaveRoom.bind(this);
        this.startGame = this.startGame.bind(this);
        this.updatePlayerList = this.updatePlayerList.bind(this);
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.updateWinner = this.updateWinner.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    public getUsername() {
        return this.props.username;
    }

    public getRoomID() {
        return this.props.roomid;
    }

    public leaveRoom() {
        if (this.state.room_backend !== null)
            this.state.room_backend.actionLeaveRoom();
    }

    public updatePlayerList(players: OtherPlayer[]) {
        this.setState({players});
    }

    public otherJoinedRoom(player: IPlayer): void {
        App.showTextOnSnackbar( "Player '" + player.name + "' joined room!" );
    }

    public otherLeftRoom(player: IPlayer): void {
        App.showTextOnSnackbar( "Player '" + player.name + "' left room!" );
    }

    public updateTurnInfo(activePlayer: IPlayer): void {
        this.setState({activePlayer});
    }

    public updateGameInfo(gameInfo: string): void {
        App.showTextOnSnackbar( gameInfo );
    }

    public updateWinner(winner: IPlayer): void {
        this.setState({winner});
    }

    public updateMission(mission: IMission): void {
    }

    public startGame() {
        if (this.state.room_backend)
            this.state.room_backend.actionStartGame( 10, 10);
    }

    public leftRoom() {
        window.location.href = Routes.linkToLobbyHREF();
    }

    public sendMessage(text: string) {
        if (this.state.room_backend)
            this.state.room_backend.actionSendRoomMessage(text);
    }

    public sendRoomMessage(player: IPlayer, message: string): void {
        const messages = this.state.messages;

        messages.push(new ChatMessage({player, message}));

        this.setState({messages});
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
                        <ChatInput onSend={this.sendMessage}/>
                    </div>
                </div>
            </div>
        );
    }
}
