import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Connection} from "../../Connection";
import {Login} from "../../game/components/Login";
import {Room} from "../../game/components/Room";
import {LocalPlayerManager} from "../../game/entity/LocalPlayer/LocalPlayerManager";
import {App} from "../App";
import {ChatInput} from "../components/room/ChatInput";
import {ChatMessage} from "../components/room/ChatMessage";
import {ChatMessages} from "../components/room/ChatMessages";
import {Game} from "../components/room/Game";
import {GameControl} from "../components/room/GameControl";
import {MissionInfo} from "../components/room/MissionInfo";
import {PlayerList} from "../components/room/PlayerList";
import {RoomInfo} from "../components/room/RoomInfo";
import {ShareRoomButton} from "../components/room/ShareRoomButton";
import {TurnInfo} from "../components/room/TurnInfo";
import {WinnerInfo} from "../components/room/WinnerInfo";
import {IRoomUI} from "../interfaces/IRoomUI";
import {Routes} from "../Routes";

export interface IRoomViewProps extends RouteComponentProps<IRoomViewProps> {
    roomid: string;
    username: string;
}

export interface IRoomViewState {
    players: IPlayer[];
    activePlayer: IPlayer;
    winner: IPlayer;
    login: Login;
    messages: ChatMessage[];
    room_backend: Room;
    gameStarted: boolean;
    isOwner: boolean;
    mission: IMission;
}

export class RoomView extends React.Component<IRoomViewProps, IRoomViewState> implements IRoomUI {

    constructor(props: IRoomViewProps) {
        super(props);

        Connection.initSocket();

        if (!Connection.getKey() || !Connection.getUsername()) {
            window.location.href = Routes.linkToLoginHREF() + "/" + this.props.match.params.roomid;
            return;
        }

        if (!LocalPlayerManager.getLocalPlayer()) {
            const color = parseInt("FF33FF", 16);
            const name = Connection.getUsername();
            const isObserver = true;

            LocalPlayerManager.addLocalPlayer(
                {name, color, isObserver},
                Connection.getKey(),
                Connection.getSocket()
            );
        }

        Room.actionJoinRoom(this.props.match.params.roomid);

        Connection._socket.once("joinedRoom", (resp: IJoinedResponse) => {

            // Update color from observer color to player color
            const localPlayer = LocalPlayerManager.getLocalPlayer();
            localPlayer.color = resp.color;
            // set whether localPlayer is new room owner
            localPlayer.isRoomOwner = LocalPlayerManager.equalsIPlayer(resp.roomOwner, localPlayer.player);

            const room_backend = new Room(
                resp.roomKey,
                resp.roomName,
                localPlayer,
                resp.otherPlayers,
                this,
                resp.gridInfo
            );

            this.setState({room_backend, gameStarted: room_backend.hasGrid(), isOwner: localPlayer.isRoomOwner});
        });
        Connection._socket.once("nameNotRegistered", () => {
            Connection.setKey("");
            Connection.setUsername("");
            window.location.href = Routes.linkToLoginHREF() + "/" + this.props.match.params.roomid;
        });

        this.state = {
            players: [],
            activePlayer: null,
            winner: null,
            login: null,
            messages: [],
            room_backend: null,
            gameStarted: false,
            isOwner: false,
            mission: null
        };

        this.leaveRoom = this.leaveRoom.bind(this);
        this.startGame = this.startGame.bind(this);
        this.updatePlayerList = this.updatePlayerList.bind(this);
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.updateWinner = this.updateWinner.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getRoomUrl = this.getRoomUrl.bind(this);
    }

    public getUsername() {
        return this.props.username;
    }

    public getRoomID() {
        return this.props.match.params.roomid;
    }

    public leaveRoom() {
        if (this.state.room_backend !== null)
            this.state.room_backend.actionLeaveRoom();
    }

    public updatePlayerList(players: IPlayer[]) {
        players.push(LocalPlayerManager.getLocalPlayer().player);
        this.setState({players});
    }

    public otherJoinedRoom(player: IPlayer): void {
        App.showTextOnSnackbar("Player '" + player.name + "' joined room!");
    }

    public otherLeftRoom(player: IPlayer): void {
        App.showTextOnSnackbar("Player '" + player.name + "' left room!");
        this.setState({isOwner: LocalPlayerManager.getLocalPlayer().isRoomOwner});
    }

    public updateTurnInfo(activePlayer: IPlayer): void {
        this.setState({activePlayer});
        if (!this.state.gameStarted) {
            this.setState({gameStarted: true});
        }
    }

    public updateGameInfo(gameInfo: string): void {
        App.showTextOnSnackbar(gameInfo);
    }

    public updateWinner(winner: IPlayer, missionName: string): void {
        // ToDo Display missionName and maybe description (so that players do understand why they lost)
        // ToDo Display (re)-startGame button to room owner
        this.setState({winner});
    }

    public updateMission(mission: IMission): void {
        console.log( "updated mission!" );
        this.setState({mission} );
    }

    public startGame() {
        if (this.state.room_backend)
            this.state.room_backend.actionStartGame(10, 10);
        this.setState({gameStarted: true});
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

    public getRoomUrl() {
        return window.location.href;
    }

    public render() {
        return (
            <div>
                <div className={"buttons"}>
                    <GameControl gameAlreadyStarted={!this.state.isOwner || this.state.gameStarted}
                                 actionStartGame={this.startGame}
                                 actionLeaveRoom={this.leaveRoom}
                    />
                </div>
                <div className={"room"}>
                    <Game/>
                    <div className={"info"}>
                        <div className={"infoContent"}>
                            <RoomInfo roomid={this.props.match.params.roomid}/>
                            <WinnerInfo winner={this.state.winner}/>
                            <PlayerList players={this.state.players}/>
                            <TurnInfo player={this.state.activePlayer}/>
                            <MissionInfo mission={this.state.mission}/>
                        </div>
                    </div>
                    <div className={"chat"}>
                        <label>Chat</label>
                        <ChatMessages messages={this.state.messages}/>
                        <ChatInput onSend={this.sendMessage}/>
                    </div>
                </div>
            </div>
        );
    }
}
