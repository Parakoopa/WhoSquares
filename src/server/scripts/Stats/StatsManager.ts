import {Room} from "../Room/Room";
import {Socket} from "socket.io";
import {IEvent} from "../Event";
import {RoomEvents} from "../Room/RoomEvents";
import {Player} from "../Room/Player";
import {UserRepository} from "../User/UserRepository";
import {RoomRepository} from "../Room/RoomRepository";
import {User} from "../User/User";
import {GlobalStatsRepository} from "./GlobalStatsRepository";

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
        room.players.players.forEach((player) => {
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
        const gridSize = room.getGridSizeX() * room.getGridSizeY();
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
        room.players.players.forEach((player) => {
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
        GlobalStatsRepository.instance.get().then((globals) => {
            globals.gamesPlayed += 1;
            globals.tilesPlaced += generalStats.tilesPlaced;
            // TODO: best user stat
            GlobalStatsRepository.instance.save(globals);
        });
    }

    /**
     * Send the room stats to the socket requesting it.
     * @param {SocketIO.Socket} socket
     * @param {IRoomStatsRequest} req
     * @param rooms
     * @returns {IEvent[]}
     */
    public static sendRoomStats(socket: Socket, req: IRoomStatsRequest, rooms: Room[]): IEvent {
        const room = rooms.find((r) => r.name === req.roomKey); // TODO: Misleading!
        if (!room || !room.hasEnded()) {
            // TODO: Better room not found response
            console.log("Requested room not found or not over: " + req.roomKey);
            return {clients: [socket], name: "roomStats", response: {}};
        }
        return {
            clients: [socket],
            name: "roomStats",
            response: {
                roomKey: room.key,
                roomName: room.name,
                gridSize: {
                    x: room.getGridSizeX(),
                    y: room.getGridSizeY()
                },
                stats: room.stats,
                replay: room.replay
            } as IRoomStatsResponse
        };
    }

    /**
     * Send the user stats to the socket requesting it.
     * @param {SocketIO.Socket} socket
     * @param {IRoomStatsRequest} req
     * @param users
     * @returns {IEvent[]}
     */
    public static sendUserStats(socket: Socket, req: IUserStatsRequest, users: Map<string, User>): IEvent {
        const user = users.get(req.playerKey);
        if (!user) {
            // TODO: Better user not found response
            return {clients: [socket], name: "userStats", response: {}};
        }
        return {
            clients: [socket],
            name: "userStats",
            response: {
                userName: user.name,
                tilesPlaced: user.tilesPlaced,
                gamesPlayed: {
                    total: user.gamesPlayed,
                    won: user.gamesWon
                }
            } as IUserStatsResponse
        };
    }

    public static async sendGlobalStats(socket: Socket, req: IGlobalStatsRequest): Promise<IEvent> {
        const globals = await GlobalStatsRepository.instance.get();
        return {
            clients: [socket],
            name: "globalStats",
            response: {
                tilesPlaced: globals.tilesPlaced,
                gamesPlayed: globals.gamesPlayed,
                bestUserName: globals.bestUserName,
            } as IGlobalStatsResponse
        };
    }
}
