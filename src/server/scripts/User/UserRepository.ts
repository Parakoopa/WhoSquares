/**
 * Interface for a user, as saved in the database
 */
import {IDatabaseModel} from "../IDatabaseModel";
import {ObjectId} from "bson";
import {DatabaseConnection} from "../DatabaseConnection";
import {Collection} from "mongodb";
import {User} from "./User";

export interface IUserMongoSchema extends IDatabaseModel {
    name: string;
    key: string;
    tilesPlaced: number; // Stats. (Re)calculated after a game finished
    gamesPlayed: number; // Stats. (Re)calculated after a game finished
    gamesWon: number; // Stats. (Re)calculated after a game finished
}

export class UserRepository {
    private static readonly COLLECTION_NAME = "users";
    private static _instance: UserRepository;
    private readonly collectionPromise: Promise<Collection<IUserMongoSchema>>;

    public static get instance(): UserRepository {
        if (!this._instance) {
            this._instance = new UserRepository();
        }
        return this._instance;
    }

    private constructor() {
        this.collectionPromise = DatabaseConnection.collection(UserRepository.COLLECTION_NAME);
        // When the collection is loaded, init index over key field.
        this.collectionPromise.then((collection) => {
            collection.createIndex("key", {unique: true});
        });
    }

    public async getByKey(key: string): Promise<User> {
        const collection = await this.collectionPromise;
        return UserRepository.transformDbToUser(await collection.findOne({key}));
    }

    public async getByObjectId(id: ObjectId): Promise<User> {
        const collection = await this.collectionPromise;
        return UserRepository.transformDbToUser(await collection.findOne({_id: id}));
    }

    public async getAll(): Promise<User[]> {
        const collection = await this.collectionPromise;
        const mongoResult = await collection.find({}).toArray();
        return mongoResult.map(UserRepository.transformDbToUser);
    }

    public async save(user: User): Promise<void> {
        const collection = await this.collectionPromise;
        await collection.updateOne({_id: user._id}, { $set: user }, {upsert: true});
    }

    public async delete(user: User): Promise<void> {
        const collection = await this.collectionPromise;
        await collection.deleteOne({_id: user._id});
    }

    private static transformDbToUser(user: IUserMongoSchema): User {
        return User.fromSchema(user);
    }
}