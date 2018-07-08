import {Room} from "./Room";
import {Collection} from "mongodb";
import {DatabaseConnection} from "../DatabaseConnection";
import {ObjectID, ObjectId} from "bson";
import {IDatabaseModel} from "../IDatabaseModel";
import {RoomToDb} from "./Transform/RoomToDb";
import {DbToRoom} from "./Transform/DbToRoom";

/**
 * The interface of a room as saved in the database
 * Only rooms that have been started or are finished are
 * saved to the DB.
 */
export interface IRoomMongoSchema extends IDatabaseModel {
    name: string;
    key: string;
    maxSize: number;
    hasEnded: boolean;
    players: IRoomMongoSchemaPlayer[]; // Only contains non-observers
    owner: string; // player key
    currentTurn: number; // player index
    gridSize: {
        x: number;
        y: number;
    };
    grid: string[][]; // player key or null
    replay: IReplayLogEntry[]; // Replay logbook. Used to record all game activities
    stats: IRoomStats; // Calculated stats, based on the end of the game
}

export interface IRoomMongoSchemaPlayer {
    index: number;
    key: string; // key as saved in user model
    color: number;
    missionName: string;
}

/**
 * Room Repository. Manages persistence (+serialization) of room objects and related data.
 */
export class RoomRepository {
    private static readonly COLLECTION_NAME = "rooms";
    private static _instance: RoomRepository;
    private readonly collectionPromise: Promise<Collection<IRoomMongoSchema>>;

    public static get instance(): RoomRepository {
        if (!this._instance) {
            this._instance = new RoomRepository();
        }
        return this._instance;
    }

    private constructor() {
        this.collectionPromise = DatabaseConnection.collection(RoomRepository.COLLECTION_NAME);
        // When the collection is loaded, init index over key field.
        this.collectionPromise.then((collection) => {
           collection.createIndex("key", {unique: true});
        });
    }

    public async getByKey(key: string): Promise<Room> {
        const collection = await this.collectionPromise;
        return await RoomRepository.transformDbToRoom(await collection.findOne({key}));
    }

    public async getByObjectId(id: ObjectId): Promise<Room> {
        const collection = await this.collectionPromise;
        return await RoomRepository.transformDbToRoom(await collection.findOne({_id: id}));
    }

    public async getAll(): Promise<Room[]> {
        const collection = await this.collectionPromise;
        const mongoResult = await collection.find({}).toArray();
        return await Promise.all(mongoResult.map(RoomRepository.transformDbToRoom));
    }

    public async save(room: Room): Promise<ObjectId> {
        const collection = await this.collectionPromise;
        if (!room._id) {
            // This is a new room, give it an object id.
            room._id = new ObjectID();
        }
        const result = await collection.updateOne({_id: room._id}, { $set: new RoomToDb(room).transform() }, {upsert: true});
        return room._id;
    }

    public async delete(room: Room): Promise<void> {
        const collection = await this.collectionPromise;
        await collection.deleteOne({_id: room._id});
    }

    private static async transformDbToRoom(mongoRoom: IRoomMongoSchema): Promise<Room> {
        return new DbToRoom(mongoRoom).transform();
    }
}
