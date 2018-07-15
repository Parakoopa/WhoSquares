import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Connection} from "../../Connection";
import {Login} from "../../game/components/Login";
import {Room} from "../../game/components/Room";
import {LocalPlayerManager} from "../../game/entity/LocalPlayer/LocalPlayerManager";
import {App} from "../App";
import {LogoutButton} from "../components/header/LogoutButton";
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
import {Missions} from "../../../../common/scripts/Missions/Missions";

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
        this.logout = this.logout.bind(this);

        // Initialize the Socket and logs the User in.

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

        // Joins a Room

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

            // Set mission data if received because this is a reconnect
            if (resp.mission) {
                room_backend.updateMission(Missions.getMission(resp.mission));
            }

            this.setState({room_backend, gameStarted: room_backend.hasGrid(), isOwner: localPlayer.isRoomOwner});
        });

        Connection._socket.on("disconnect", this.onDisconnect);
        Connection._socket.on("reconnecting", this.onDisconnect);

        Connection._socket.once("nameNotRegistered", () => {
            Connection.setKey("");
            Connection.setUsername("");
            window.location.href = Routes.linkToLoginHREF() + "/" + this.props.match.params.roomid;
        });
        Connection._socket.once("gameEnded", () => {
            window.location.href = Routes.linkToGameStatsHREF(this.props.match.params.roomid);
        });
    }

    public componentWillUnmount() {
        Connection._socket.removeEventListener("disconnect", this.onDisconnect);
        Connection._socket.removeEventListener("reconnecting", this.onDisconnect);
    }

    public getUsername() {
        return this.props.username;
    }

    public getRoomID() {
        return this.props.match.params.roomid;
    }

    /**
     * Logs out the User
     */
    public logout() {
        Connection.setUsername("");
        Connection.setKey("");

        if (this.state.room_backend !== null) {
            this.state.room_backend.actionLeaveRoom(() => {
                window.location.href = Routes.linkToLoginHREF();
            });
        }
    }

    /**
     * Leaves the Room and links to lobby, if everything went good.
     */
    public leaveRoom() {
        if (this.state.room_backend !== null) {
            this.state.room_backend.actionLeaveRoom(() => {
                window.location.href = Routes.linkToLobbyHREF();
            });
        }
    }

    /**
     * Updates the Playerlist
     *
     * @param {IPlayer[]} playerlist
     */
    public updatePlayerList(playerlist: IPlayer[]) {
        const players = [];
        for (const player of playerlist) {
            players.push(player);
        }
        players.push(LocalPlayerManager.getLocalPlayer().player);
        this.setState({players});
    }

    /**
     * Notify the user if someone joined
     *
     * @param {IPlayer} player
     */
    public otherJoinedRoom(player: IPlayer): void {
        App.showTextOnSnackbar("Player " + player.name + " joined room!");
    }

    /**
     * Notify the user if someone left
     *
     * @param {IPlayer} player
     */
    public otherLeftRoom(player: IPlayer): void {
        App.showTextOnSnackbar("Player " + player.name + " left room!");
        this.setState({isOwner: LocalPlayerManager.getLocalPlayer().isRoomOwner});
    }

    /**
     * Updates the TurnInfo
     *
     * @param {IPlayer} activePlayer
     */
    public updateTurnInfo(activePlayer: IPlayer): void {
        this.setState({activePlayer});
        if (!this.state.gameStarted) {
            this.setState({gameStarted: true});
        }
    }

    /**
     * Shows Text on Snackbar.
     *
     * @param {string} info
     */
    public updateGameInfo(gameInfo: string): void {
        App.showTextOnSnackbar(gameInfo);
    }

    /**
     * Updates the Winner
     *
     * @param {IPlayer} winner
     * @param {string} missionName
     */
    public updateWinner(winner: IPlayer, missionName: string): void {
        // TODO: Show this also in chat
        this.setState({winner});
    }

    /**
     * Updates the Mission
     *
     * @param {IMission} mission
     */
    public updateMission(mission: IMission): void {
        console.log("updated mission!");
        this.setState({mission});
    }

    /**
     * Starts the Game
     */
    public startGame() {
        if (this.state.room_backend)
            this.state.room_backend.actionStartGame(10, 10);
        this.setState({gameStarted: true});
    }

    /**
     * Send a Message to the Server.
     *
     * @param {string} text
     */
    public sendMessage(text: string) {
        if (this.state.room_backend)
            this.state.room_backend.actionSendRoomMessage(text);
    }

    /**
     * Gets a new Message
     *
     * @param {IPlayer} player
     * @param {string} message
     */
    public sendRoomMessage(player: IPlayer, message: string): void {
        const messages = this.state.messages;

        messages.push(new ChatMessage({player, message}));

        this.setState({messages});
    }

    /**
     * Gets the RoomURL
     *
     * @returns {string}
     */
    public getRoomUrl() {
        return window.location.href;
    }

    public componentDidMount() {
        LogoutButton.logOutFunction = this.logout;
    }

    /**
     * If Disconnected, reconnect!
     */
    public onDisconnect() {
        // TODO: Better reconnect
        window.location.reload();
    }

    public render() {
        return (
            <div>
                <div className={"content roomHeader"}>
                    <RoomInfo roomid={this.props.match.params.roomid}/>
                    <ShareRoomButton roomurl={this.getRoomUrl()}/>
                </div>
                <div className={"buttons"}>
                    <GameControl
                        gameEnded={!!this.state.winner}
                        gameAlreadyStarted={!this.state.isOwner || this.state.gameStarted}
                        actionStartGame={this.startGame}
                        actionLeaveRoom={this.leaveRoom}
                        roomid={this.props.match.params.roomid}
                    />
                </div>
                <div className={"room"}>
                    <Game/>
                    <div className={"info"}>
                        <div className={"infoMission"}>
                            <MissionInfo mission={this.state.mission}/>
                        </div>
                        <div className={"infoPlayers"}>
                            <PlayerList
                                players={this.state.players}
                                winner={this.state.winner}
                                turn={this.state.activePlayer}
                            />
                        </div>
                    </div>
                    <div className={"chatContainer"}>
                        <div className={"chat"}>
                            <label className={"chatTitle"}>Chat</label>
                            <img alt="Mission"
                                 className={"iconChat"}
                                 src={"../../img/icons/Chat.png"}
                                 width="30em" height="30em"
                            />
                            <div className={"chatBody"}>
                                <ChatMessages messages={this.state.messages}/>
                            </div>
                            <ChatInput onSend={this.sendMessage}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
