import {Client} from "../Client/Client";
import {IEvent} from "../Event";

/**
 * Eventbuilder for lobby specific events
 */
export class LobbyEvents {

    /**
     * Return RoomIsFullEvent
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public roomIsFullEvent(client: Client, roomName: string): IEvent {
        const response: IRoomIsFullResponse = {response: "roomIsFull", roomName};
        return {clients: [client], name: "roomIsFull", response};
    }

    /**
     * Return NotOwnerEvent
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public notOwnerEvent(client: Client, roomName: string): IEvent {
        const response: INotOwnerResponse = {response: "notOwner", roomName};
        return {clients: [client], name: "notOwner", response};
    }

    /**
     * Return NotInRoomEvent
     * @param {Client} client
     * @returns {IEvent}
     */
    public notInRoomEvent(client: Client): IEvent {
        const response: INotInRoomResponse = {response: "notInRoom"};
        return {clients: [client], name: "notInRoom", response};
    }

    /**
     * Return LeftEvent
     * @param {Client} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public leftEvent(client: Client, roomName: string): IEvent {
        const leftResponse: ILeftResponse = {response: "leftRoom",  roomName};
        return {clients: [client], name: "leftRoom", response: leftResponse}; // no one else in room to notify
    }

    /**
     * Return OtherLeftRoomEvent
     * @param {Client[]} clients
     * @param {string} roomName
     * @param {IPlayer} player
     * @returns {IEvent}
     */
    public otherLeftEvent(clients: Client[], roomName: string, player: IPlayer): IEvent {
        const otherLeftResponse: IOtherLeftResponse = {response: "otherLeftRoom",
            roomName,
            player
        };
        return {clients, name: "otherLeftRoom", response: otherLeftResponse
        };
    }

}
