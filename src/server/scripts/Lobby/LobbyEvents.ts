import {IEvent} from "../Event";
import {Socket} from "socket.io";
import {Room} from "../Room/Room";

/**
 * Eventbuilder for lobby specific events
 */
export class LobbyEvents {

    /**
     * Return RoomList
     * @param {Socket} client
     * @param roomsRaw
     * @returns {}
     */
    public roomListEvent(client: Socket, roomsRaw: Room[]): IEvent {
        const rooms = roomsRaw.map((room) => {
            return {
                name: room.name,
                key: room.key,
                ended: room.hasEnded()
            };
        });
        return {clients: [client], name: "roomList", response: {rooms}};
    }

    /**
     * Return RoomIsFullEvent
     * @param {Socket} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public roomIsFullEvent(client: Socket, roomName: string): IEvent {
        return {clients: [client], name: "roomIsFull", response: {roomName}};
    }

    /**
     * Return RoomHasEndedEvent
     * @param {Socket} client
     * @param {string} roomName
     * @returns {IEvent}
     */
    public roomHasEndedEvent(client: Socket, roomName: string): IEvent {
        return {clients: [client], name: "gameEnded", response: {roomName}};
    }

    /**
     * Return NotInRoomEvent
     * @param {Socket} client
     * @returns {IEvent}
     */
    public notInRoomEvent(client: Socket): IEvent {
        return {clients: [client], name: "notInRoom", response: {}};
    }

    /**
     * Return NameNotRegistered
     * @param {Socket} client
     * @returns {IEvent}
     */
    public nameNotRegisteredEvent(client: Socket): IEvent {
        return {clients: [client], name: "nameNotRegistered", response: {}};
    }

}
