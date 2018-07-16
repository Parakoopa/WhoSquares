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
 * GlobalStatsRepository. Manages persistence (+serialization) of global statistics.
 * The repository is a singleton that manages a single model instance.
 */
export class GlobalStatsRepository {
    private static readonly COLLECTION_NAME = "global";
    private static _instance: GlobalStatsRepository;
    private readonly collectionPromise: Promise<Collection<IGlobalStatsMongoSchema>>;
    private objectId: ObjectID = new ObjectID("globalStats_");

    /**
     * This class is a singleton, get it's instance.
     * @returns {GlobalStatsRepository}
     */
    public static get instance(): GlobalStatsRepository {
        if (!this._instance) {
            this._instance = new GlobalStatsRepository();
        }
        return this._instance;
    }

    /**
     * Loads the database collection
     */
    private constructor() {
        this.collectionPromise = DatabaseConnection.collection(GlobalStatsRepository.COLLECTION_NAME);
    }

    /**
     * Get the global statistic model instance
     * @returns {Promise<IGlobalStatsMongoSchema>}
     */
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

    /**
     * Save the global statistics instance.
     * The _id field is ignored and instead set to the expected value for this model.
     * @param {IGlobalStatsMongoSchema} stats
     * @returns {Promise<void>}
     */
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
