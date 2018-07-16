import {IDatabaseModel} from "../IDatabaseModel";
import {ObjectId} from "bson";
import {DatabaseConnection} from "../DatabaseConnection";
import {Collection} from "mongodb";
import {User} from "./User";

/**
 * Interface for a user, as saved in the database
 */
export interface IUserMongoSchema extends IDatabaseModel {
    name: string;
    key: string;
    tilesPlaced: number; // Stats. (Re)calculated after a game finished
    gamesPlayed: number; // Stats. (Re)calculated after a game finished
    gamesWon: number; // Stats. (Re)calculated after a game finished
}

/**
 * UserRepository. Manages persistence of users.
 */
export class UserRepository {
    private static readonly COLLECTION_NAME = "users";
    private static _instance: UserRepository;
    private readonly collectionPromise: Promise<Collection<IUserMongoSchema>>;

    /**
     * Get the singleton instance.
     * @returns {UserRepository}
     */
    public static get instance(): UserRepository {
        if (!this._instance) {
            this._instance = new UserRepository();
        }
        return this._instance;
    }

    /**
     * Loads the repository by loading it's collection and creating the indices.
     */
    private constructor() {
        this.collectionPromise = DatabaseConnection.collection(UserRepository.COLLECTION_NAME);
        // When the collection is loaded, init index over key field.
        this.collectionPromise.then((collection) => {
            collection.createIndex("key", {unique: true});
        });
    }

    /**
     * Get a user by key
     * @param {string} key
     * @returns {Promise<User>}
     */
    public async getByKey(key: string): Promise<User> {
        const collection = await this.collectionPromise;
        return UserRepository.transformDbToUser(await collection.findOne({key}));
    }

    /**
     * Get a user by MongoDB ObjectID
     * @param {ObjectID} id
     * @returns {Promise<User>}
     */
    public async getByObjectId(id: ObjectId): Promise<User> {
        const collection = await this.collectionPromise;
        return UserRepository.transformDbToUser(await collection.findOne({_id: id}));
    }

    /**
     * Get all users
     * @returns {Promise<User[]>}
     */
    public async getAll(): Promise<User[]> {
        const collection = await this.collectionPromise;
        const mongoResult = await collection.find({}).toArray();
        return mongoResult.map(UserRepository.transformDbToUser);
    }

    /**
     * Save a user model to the DB
     * @param {User} user
     * @returns {Promise<void>}
     */
    public async save(user: User): Promise<void> {
        const collection = await this.collectionPromise;
        await collection.updateOne({_id: user._id}, { $set: user }, {upsert: true});
    }

    /**
     * Delete a user model from the DB
     * @param {User} user
     * @returns {Promise<void>}
     */
    public async delete(user: User): Promise<void> {
        const collection = await this.collectionPromise;
        await collection.deleteOne({_id: user._id});
    }

    /**
     * Transform a database user to a User Model.
     * @param {IUserMongoSchema} user
     * @returns {User}
     */
    private static transformDbToUser(user: IUserMongoSchema): User {
        return User.fromSchema(user);
    }
}