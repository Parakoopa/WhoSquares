import {Room} from "../Room";
import {IRoomMongoSchema, IRoomMongoSchemaPlayer} from "../RoomRepository";

/**
 * Transforms a {Room} to a {IRoomMongoSchema}
 */
export class RoomToDb {

    /**
     * Initialise transform class with room object
     * @param {Room} room
     */
    constructor(
        private room: Room
    ) {}

    /**
     * Executes the transformation.
     * @returns {IRoomMongoSchema}
     */
    public transform(): IRoomMongoSchema {
        return {
            _id: this.room._id,
            name: this.room.name,
            key: this.room.key,
            maxSize: this.room.maxSize,
            hasEnded: this.room._gameEnded,
            players: this.getPlayers(),
            owner: this.room._owner.user.key,
            currentTurn: this.room._turnManager.curIndex(),
            grid: this.getGrid(),
            gridSize: {
                x: this.room._serverGrid.sizeX,
                y: this.room._serverGrid.sizeY
            },
            replay: this.room.replay,
            stats: this.room.stats
        };
    }

    /**
     * Transforms room player list to database player list
     * @returns {IRoomMongoSchemaPlayer[]}
     */
    private getPlayers(): IRoomMongoSchemaPlayer[] {
        const list: IRoomMongoSchemaPlayer[] = [];
        let index = 0;
        this.room.players.list.forEach((player) => {
            if (player.isObserver) return; // Don't add observers
            list.push({
                index: index++,
                key: player.user.key,
                color: player.color,
                missionName: player.mission.constructor.name
            });
        });
        return list;
    }

    /**
     * Transforms the grid.
     * @returns {string[][]}
     */
    private getGrid(): string[][] {
        const serializedGrid: string[][] = [];
        const grid = this.room._serverGrid.gridInfo;
        for (let y = 0; y < grid.length; y++) {
            serializedGrid[y] = [];
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x]) {
                    serializedGrid[y][x] = grid[y][x].user.key;
                } else {
                    serializedGrid[y][x] = null;
                }
            }
        }
        return serializedGrid;
    }
}
