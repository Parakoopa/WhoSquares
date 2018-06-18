import {Client} from "../Client/Client";
import {IEvent} from "../Event";

export class LobbyEvents {

    public roomIsFullEvent(client: Client, roomName: string): IEvent {
        const response: IRoomIsFullResponse = {response: "roomIsFull", roomName};
        return {clients: [client], name: "roomIsFull", response};
    }

    public notOwnerEvent(client: Client, roomName: string): IEvent {
        const response: INotOwnerResponse = {response: "notOwner", roomName};
        return {clients: [client], name: "notOwner", response};
    }

    public notInRoomEvent(client: Client): IEvent {
        const response: INotInRoomResponse = {response: "notInRoom"};
        return {clients: [client], name: "notInRoom", response};
    }

    public leftEvent(client: Client, roomName: string): IEvent {
        const leftResponse: ILeftResponse = {response: "leftRoom",  roomName};
        return {clients: [client], name: "leftRoom", response: leftResponse}; // no one else in room to notify
    }

    public otherLeftEvent(clients: Client[], roomName: string, player: IPlayer): IEvent {
        const otherLeftResponse: IOtherLeftResponse = {response: "otherLeftRoom",
            roomName,
            player
        };
        return {
            clients,
            name: "otherLeftRoom",
            response: otherLeftResponse
        };
    }

}
