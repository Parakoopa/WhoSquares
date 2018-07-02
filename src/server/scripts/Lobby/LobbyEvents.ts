import {Client} from "../Client/Client";
import {IEvent} from "../Event";

/**
 * Eventbuilder for lobby specific events
 */
export class LobbyEvents {

    /**
     * Return AlreadyInRoomEvent
     * @param {Client} client
     * @param rooms
     * @returns {}
     */
    public joinLobbyEvent(client: Client, rooms: string[]): IEvent {
        return {clients: [client], name: "joinLobby", response: {rooms}};
    }

    /**
     * Return AlreadyInRoomEvent
     * @param {Client} client
     * @returns {}
     */
    public alreadyInRoomEvent(client: Client): IEvent {
       return {clients: [client], name: "alreadyInRoom", response: {}};
    }

    /**
     * Return RoomIsFullEvent
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public roomIsFullEvent(client: Client, roomName: string): IEvent {
        return {clients: [client], name: "roomIsFull", response: {roomName}};
    }

    /**
     * Return NotOwnerEvent
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public notOwnerEvent(client: Client, roomName: string): IEvent {
        return {clients: [client], name: "notOwner", response: {roomName}};
    }

    /**
     * Return NotInRoomEvent
     * @param {Client} client
     * @returns {IEvent}
     */
    public notInRoomEvent(client: Client): IEvent {
        return {clients: [client], name: "notInRoom", response: {}};
    }

    /**
     * Return LeftEvent
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public leftEvent(client: Client, roomName: string): IEvent {
        return {clients: [client], name: "leftRoom", response:  {roomName}}; // no one else in room to notify
    }

    /**
     * Return OtherLeftRoomEvent
     * @param {Client[]} clients
     * @param {string} roomName
     * @param {IPlayer} player
     * @returns {IEvent}
     */
    public otherLeftEvent(clients: Client[], roomName: string, player: IPlayer): IEvent {
        const otherLeftResponse: IOtherLeftResponse = {roomName, player};
        return {clients, name: "otherLeftRoom", response: otherLeftResponse};
    }

}
