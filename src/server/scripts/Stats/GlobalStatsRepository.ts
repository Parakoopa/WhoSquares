import {Collection} from "mongodb";
import {DatabaseConnection} from "../DatabaseConnection";
import {ObjectID} from "bson";
import {IDatabaseModel} from "../IDatabaseModel";

/**
 * The interface of global statistics as saved in the DB
 */
export interface IGlobalStatsMongoSchema extends IDatabaseModel, IGlobalStatsResponse {
}

/**
 * Room Repository. Manages persistence (+serialization) of room objects and related data.
 */
export class GlobalStatsRepository {
    private static readonly COLLECTION_NAME = "global";
    private static _instance: GlobalStatsRepository;
    private readonly collectionPromise: Promise<Collection<IGlobalStatsMongoSchema>>;
    private objectId: ObjectID = new ObjectID("globalStats_");

    public static get instance(): GlobalStatsRepository {
        if (!this._instance) {
            this._instance = new GlobalStatsRepository();
        }
        return this._instance;
    }

    private constructor() {
        this.collectionPromise = DatabaseConnection.collection(GlobalStatsRepository.COLLECTION_NAME);
    }

    public async get(): Promise<IGlobalStatsMongoSchema> {
        const collection = await this.collectionPromise;
        const instance = await collection.findOne({_id: this.objectId});
        if (instance) {
            return instance;
        }
        // return new global stats
        return {
            _id: this.objectId,
            bestUserName: null,
            tilesPlaced: 0,
            gamesPlayed: 0
        };
    }

    public async save(stats: IGlobalStatsMongoSchema): Promise<void> {
        const collection = await this.collectionPromise;
        stats._id = this.objectId;
        const result = await collection.updateOne(
            {_id: this.objectId},
            { $set: stats },
            {upsert: true}
        );
    }
}
