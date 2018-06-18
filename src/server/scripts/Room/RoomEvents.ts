import {Client} from "../Client/Client";
import {LocalPlayer} from "../Client/Player/LocalPlayer";
import {IEvent} from "../Event";

/**
 * A Room hosts a game for clients
 * Each client gets a color assigned
 */
export class RoomEvents {

    public joinedEvent(
        client: Client, roomName: string, roomKey: string,
        color: number, otherPlayers: IPlayer[], gridInfo: IPlayer[][]): IEvent {
        const response: IJoinedResponse = {
            response: "joinedRoom",
            roomName,
            roomKey,
            color,
            otherPlayers,
            gridInfo
        };
        return{clients: [client], name: "joinedRoom", response};
    }

    public startEvent(clients: Client[], roomName: string, sizeX: number, sizeY: number): IEvent {
        const startResponse: IStartGameResponse = {response: "startGame", roomName, sizeX, sizeY};
        return {clients, name: "startGame", response: startResponse};
    }

    public otherJoinedEvent(clients: Client[], roomName: string, localPlayer: LocalPlayer): IEvent {
        const response: IOtherJoinedResponse = {response: "otherJoinedRoom", roomName, otherPlayer: localPlayer.player};
        return {clients, name: "otherJoinedRoom", response};
    }

    public observerEvent(client: Client): IEvent {
        const response: IObserverResponse = {response: "observer"};
        return {clients: [client], name: "observer", response};
    }

    public informTurnEvent(clients: Client[], player: IPlayer): IEvent {
        const response: IInformTurnResponse = {response: "informTurn", player};
        return {clients, name: "informTurn", response};
    }

    public placedEvent(clients: Client[], roomName: string, player: IPlayer, y: number, x: number): IEvent {
        const response: IPlacedTileResponse = {response: "placedTile", roomName, player, y, x};
        return {clients, name: "placedTile", response};
    }

    public notYourTurnEvent(client: Client, roomName: string): IEvent {
        const response: INotYourTurnResponse = {response: "notYourTurn", roomName};
        return {clients: [client], name: "notYourTurn", response};
    }

    public winGameEvent(clients: Client[], roomName: string, player: IPlayer): IEvent {
        const response: IWinGameResponse = {response: "winGame", roomName, player};
        return {clients, name: "winGame", response};
    }

    public invalidPlacement(client: Client, roomName: string): IEvent {
        const response: IInvalidPlacement = {response: "invalidPlacement", roomName};
        return {clients: [client], name: "invalidPlacement", response};
    }

}
