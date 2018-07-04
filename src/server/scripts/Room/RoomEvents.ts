import {Client} from "../Client/Client";
import {IEvent} from "../Event";

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
        client: Client, roomName: string, roomKey: string,
        color: number, otherPlayers: IPlayer[], gridInfo: IPlayer[][]): IEvent {
        const response: IJoinedResponse = {
            roomName,
            roomKey,
            color,
            otherPlayers,
            gridInfo
        };
        return{clients: [client], name: "joinedRoom", response};
    }

    /**
     * Client(room owner) started game and all clients in room get
     * grid properties via IStartGameResponse
     * @param {Client[]} clients
     * @param {string} roomName
     * @param {number} sizeX
     * @param {number} sizeY
     * @returns {IEvent}
     */
    public startEvent(clients: Client[], roomName: string, sizeX: number, sizeY: number): IEvent[] {
        const startEvents: IEvent[] = [];
        for (const client of clients) {
            const response: IStartGameResponse = {roomName, sizeX, sizeY, missionName: client.mission.constructor.name};
            startEvents.push({clients: [client], name: "startGame", response});
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
    public otherJoinedEvent(clients: Client[], roomName: string, otherPlayer: IPlayer): IEvent {
        const response: IOtherJoinedResponse = {roomName, otherPlayer};
        return {clients, name: "otherJoinedRoom", response};
    }

    /**
     * Inform Client that he joined a game as observer
     * via IObserverResponse
     * @param {Client} client
     * @returns {IEvent}
     */
    public observerEvent(client: Client): IEvent {
        return {clients: [client], name: "observer", response: {}};
    }

    /**
     * Inform all clients in room of player at turn via IInformTurnResponse
     * @param {Client[]} clients
     * @param {IPlayer} player
     * @returns {IEvent}
     */
    public informTurnEvent(clients: Client[], player: IPlayer): IEvent {
        return {clients, name: "informTurn", response: {player}};
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
    public placedEvent(clients: Client[], roomName: string, player: IPlayer, y: number, x: number): IEvent {
        const response: IPlacedTileResponse = {roomName, player, y, x};
        return {clients, name: "placedTile", response};
    }

    public roomMessageEvent(clients: Client[], roomName: string, player: IPlayer, message: string ): IEvent {
        const response: IRoomMessageResponse = {roomName, player, message};
        return {clients, name: "roomMessage", response};
    }

    /**
     * Inform client that he is not at turn via INotYourTurnResponse
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public notYourTurnEvent(client: Client, roomName: string): IEvent {
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
    public winGameEvent(clients: Client[], roomName: string, player: IPlayer): IEvent {
        const response: IWinGameResponse = {roomName, player};
        return {clients, name: "winGame", response};
    }

    /**
     * Inform client that his tile placement is invalid
     * via IInvalidPlacementResponse
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public invalidPlacement(client: Client, roomName: string): IEvent {
        return {clients: [client], name: "invalidPlacement", response: {roomName}};
    }

    public gameAlreadyEnded(client: Client, roomName: string): IEvent {
        return {clients: [client], name: "gameAlreadyEnded", response: {roomName}};
    }

}
