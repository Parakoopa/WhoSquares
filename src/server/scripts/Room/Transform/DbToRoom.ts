import {Missions} from "../../../../common/scripts/Missions/Missions";
import {UserRepository} from "../../User/UserRepository";
import {ServerGrid} from "../Game/ServerGrid";
import {Player} from "../Player";
import {Room} from "../Room";
import {IRoomMongoSchema} from "../RoomRepository";

/**
 * Transforms a {IRoomMongoSchema} to a {Room}
 */
export class DbToRoom {

    /**
     * Initialise transform class with a schema.
     * @param {IRoomMongoSchema} schema
     */
    constructor(
        private schema: IRoomMongoSchema
    ) {}

    /**
     * Execute the transformations. Returns the room representing the schema.
     * @returns {Promise<Room>}
     */
    public async transform(): Promise<Room> {
        const room = new Room(
            this.schema.name,
            this.schema.key,
            this.schema.maxSize
        );
        room._gameEnded = this.schema.hasEnded;
        await this.buildPlayers(room);
        room._serverGrid = this.buildGrid(room);
        this.fillTurnManager(room);
        room._owner = room.players.getPlayerByPlayerKey(this.schema.owner);
        room._id = this.schema._id;
        room.replay = this.schema.replay;
        room.stats = this.schema.stats;
        return room;
    }

    /**
     * Convert player information
     * @param {Room} room
     * @returns {Promise<Player[]>}
     */
    private async buildPlayers(room: Room): Promise<Player[]> {
        for (const player of this.schema.players) {
            const playerObj = new Player(
                await UserRepository.instance.getByKey(player.key),
                null,
                player.color,
                false
            );
            playerObj.mission = Missions.getMission(player.missionName);
            room.players.push(playerObj);
        }
        return room.players.list;
    }

    /**
     * Build the grid from database information
     * @param {Room} room
     * @returns {ServerGrid}
     */
    private buildGrid(room: Room): ServerGrid {
        const grid = new ServerGrid(
            this.schema.gridSize.x,
            this.schema.gridSize.y
        );
        for (let y = 0; y < this.schema.gridSize.y; y++) {
            for (let x = 0; x < this.schema.gridSize.x; x++) {
                if (this.schema.grid[y][x]) {
                    grid.placeTile(room.players.getPlayerByPlayerKey(
                        this.schema.grid[y][x]
                    ), y, x);
                }
            }
        }
        return grid;
    }

    /**
     * Fill the turn manager of the room with the correct information
     * @param {Room} room
     */
    private fillTurnManager(room: Room) {
        room.players.list.forEach((player) => {
            room._turnManager.addPlayer(player);
        });
        room._turnManager.setCurIndex(this.schema.currentTurn);
    }
}
