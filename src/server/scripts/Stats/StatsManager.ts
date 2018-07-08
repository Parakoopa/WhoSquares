import {Room} from "../Room/Room";
import {Socket} from "socket.io";
import {IEvent} from "../Event";
import {RoomEvents} from "../Room/RoomEvents";
import {Player} from "../Room/Player";
import {UserRepository} from "../User/UserRepository";
import {RoomRepository} from "../Room/RoomRepository";

export class StatsManager {
    /**
     * Reads all information from the room's replay and current state
     * and calculates statistics for the room based on that.
     * Then updates the user's statistics of the users that were part of the room
     * After that updates the global stats.
     *
     * All rooms, users and the global stats are saved in the process.
     * @param {Room} room
     * @param winner
     */
    public static processRoomEnd(room: Room, winner: Player) {
        const generalStats = {
            coverage: 0, // updated while iterating over grid
            tilesPlaced: 0, // updated while iterating over grid
            numberTurns: room.getCurrentTurnNumber()
        };
        // Collect general player stats
        const players = new Map<number, IRoomStatsPlayer>();
        room._players.forEach((player) => {
            if (player.isObserver) {
                return; // Observers don't have stats
            }
            players.set(player.color, {
                base: RoomEvents.stripPlayer(player),
                missionName: player.mission.constructor.name,
                coverage: 0, // updated while iterating over grid
                tilesPlaced: 0, // updated while iterating over grid
                owner: player === room._owner,
                winner: player === winner
            });
        });
        // Collect grid stats
        const gridSize = room._serverGrid.size;
        room.gridInfo.forEach((r) => {
            r.forEach((tile) => {
                if (tile) {
                    players.get(tile.color).tilesPlaced++;
                    generalStats.tilesPlaced++;
                }
            });
        });

        // Update room coverage
        generalStats.coverage = generalStats.tilesPlaced / gridSize;

        // Calculate user coverage + update user stats
        room._players.forEach((player) => {
            const playerInRoomStatsMap = players.get(player.color);
            playerInRoomStatsMap.coverage = playerInRoomStatsMap.tilesPlaced / gridSize;
            player.user.tilesPlaced += playerInRoomStatsMap.tilesPlaced;
            player.user.gamesPlayed += 1;
            if (player === winner) {
                player.user.gamesWon += 1;
            }
            UserRepository.instance.save(player.user);
        });

        // Update room stats
        room.stats = {
            players: Array.from(players.values()),
            general: generalStats
        };
        RoomRepository.instance.save(room);

        // Update global stats
        // TODO
    }

    /**
     * Send the room stats to the socket requesting it.
     * TODO: error cases
     * @param {SocketIO.Socket} socket
     * @param {IRoomStatsRequest} req
     * @returns {IEvent[]}
     */
    public static sendRoomStats(socket: Socket, req: IRoomStatsRequest): IEvent[] {
        return []; // TODO
    }

    /**
     * Send the user stats to the socket requesting it.
     * TODO: error cases
     * @param {SocketIO.Socket} socket
     * @param {IRoomStatsRequest} req
     * @returns {IEvent[]}
     */
    public static sendUserStats(socket: Socket, req: IUserStatsRequest): IEvent[] {
        return []; // TODO
    }

    public static sendGlobalStats(socket: Socket, req: IGlobalStatsRequest): IEvent[] {
        return []; // TODO
    }
}
