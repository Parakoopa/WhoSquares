import {IEvent} from "../Event";

/**
 * Outgoing messages via socket.io
 */
export class ResponseEmitter {

    /**
     * Emits a Response to all clients listed in IEvent
     * @param {IEvent} event
     */
    private emitEvent(event: IEvent): void {
        console.log("Emitted to Players: " + event.name + " to: " + event.clients);
        for (let i = 0; i < event.clients.length; i++) {
            if (event.clients[i]) {
                event.clients[i].emit(event.name, event.response);
            }
        }
    }

    /**
     * Emits Multiple Events made of Responses to multiple Players
     * @param {IEvent[]} events
     */
    public emitEvents(events: IEvent[]): void {
        for (let i = 0; i < events.length; i++) {
            this.emitEvent(events[i]);
        }
    }
}
