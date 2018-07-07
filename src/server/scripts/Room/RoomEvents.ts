import {IEvent} from "../Event";
import {Socket} from "socket.io";
import {Player} from "./Player";

/**
 * An Eventbuilder for room specific events
 */
export class RoomEvents {

    /**
     * A client has successfully joined a room and gets
     * his room properties via IJoinedResponse
     * @param {Client} client
     * @param {string} roomName
     * @param {string} roomKey
     * @param {number} color
     * @param {IPlayer[]} otherPlayers
     * @param {IPlayer[][]} gridInfo
     * @returns {IEvent}
     */
    public joinedEvent(
        client: Socket, roomName: string, roomKey: string,
        color: number, otherPlayers: IPlayer[], gridInfo: IPlayer[][]): IEvent {
        const response: IJoinedResponse = {
            roomName,
            roomKey,
            color,
            otherPlayers: otherPlayers.map((op) => RoomEvents.stripPlayer(op)),
            gridInfo
        };
        return{clients: [client], name: "joinedRoom", response};
    }

    /**
     * Client(room owner) started game and all clients in room get
     * grid properties via IStartGameResponse
     * @param players
     * @param {string} roomName
     * @param {number} sizeX
     * @param {number} sizeY
     * @returns {IEvent}
     */
    public startEvent(players: Player[], roomName: string, sizeX: number, sizeY: number): IEvent[] {
        const startEvents: IEvent[] = [];
        for (const player of players) {
            const response: IStartGameResponse = {roomName, sizeX, sizeY, missionName: player.mission.constructor.name};
            startEvents.push({clients: [player.socket], name: "startGame", response});
        }
        return startEvents;
    }

    /**
     * A Client joined a room and all other clients in room
     * have to be notified of him via IOtherJoinedRoomResponse
     * @param {Client[]} clients
     * @param {string} roomName
     * @param otherPlayer
     * @returns {IEvent}
     */
    public otherJoinedEvent(clients: Socket[], roomName: string, otherPlayer: IPlayer): IEvent {
        const response: IOtherJoinedResponse = {roomName, otherPlayer: RoomEvents.stripPlayer(otherPlayer)};
        return {clients, name: "otherJoinedRoom", response};
    }

    /**
     * Inform Client that he joined a game as observer
     * via IObserverResponse
     * @param {Client} client
     * @returns {IEvent}
     */
    public observerEvent(client: Socket): IEvent {
        return {clients: [client], name: "observer", response: {}};
    }

    /**
     * Inform all clients in room of player at turn via IInformTurnResponse
     * @param {Client[]} clients
     * @param {IPlayer} player
     * @returns {IEvent}
     */
    public informTurnEvent(clients: Socket[], player: IPlayer): IEvent {
        return {clients, name: "informTurn", response: {player: RoomEvents.stripPlayer(player)}};
    }

    /**
     * Inform all clients in room of a tile that has been claimed by player
     * via IPlacedTileResponse
     * @param {Client[]} clients
     * @param {string} roomName
     * @param {IPlayer} player
     * @param {number} y
     * @param {number} x
     * @returns {IEvent}
     */
    public placedEvent(clients: Socket[], roomName: string, player: IPlayer, y: number, x: number): IEvent {
        const response: IPlacedTileResponse = {roomName, player: RoomEvents.stripPlayer(player), y, x};
        return {clients, name: "placedTile", response};
    }

    public roomMessageEvent(clients: Socket[], roomName: string, player: IPlayer, message: string ): IEvent {
        const response: IRoomMessageResponse = {roomName, player: RoomEvents.stripPlayer(player), message};
        return {clients, name: "roomMessage", response};
    }

    /**
     * Inform client that he is not at turn via INotYourTurnResponse
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public notYourTurnEvent(client: Socket, roomName: string): IEvent {
        return {clients: [client], name: "notYourTurn", response: {roomName}};
    }

    /**
     * Inform all clients in room that given player has won
     * via IWinGameResponse
     * @param {Client[]} clients
     * @param {string} roomName
     * @param {IPlayer} player
     * @returns {IEvent}
     */
    public winGameEvent(clients: Socket[], roomName: string, player: IPlayer): IEvent {
        const response: IWinGameResponse = {roomName, player: RoomEvents.stripPlayer(player)};
        return {clients, name: "winGame", response};
    }

    /**
     * Inform client that his tile placement is invalid
     * via IInvalidPlacementResponse
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public invalidPlacement(client: Socket, roomName: string): IEvent {
        return {clients: [client], name: "invalidPlacement", response: {roomName}};
    }

    public gameAlreadyEnded(client: Socket, roomName: string): IEvent {
        return {clients: [client], name: "gameAlreadyEnded", response: {roomName}};
    }

    /**
     * Return NotOwnerEvent
     * @param {Socket} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public notOwnerEvent(client: Socket, roomName: string): IEvent {
        return {clients: [client], name: "notOwner", response: {roomName}};
    }

    /**
     * Return InvalidPlayerEvent
     * @param {Socket} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public invalidPlayerEvent(client: Socket, roomName: string): IEvent {
        return {clients: [client], name: "invalidPlayer", response: {roomName}};
    }

    /**
     * Remove everything from the IPlayer object that is NOT part of the interface
     * returns a new object
     * @param {IPlayer} player
     * @returns {IPlayer}
     */
    private static stripPlayer(player: IPlayer): IPlayer {
        return {name: player.name, color: player.color, isObserver: player.isObserver};
    }
}
