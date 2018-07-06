import {ObjectId} from "bson";

/**
 * Implemented by objects that are seialized into the mongo db. They need to have an id field, which is filled
 * by the mongo db client, if null. This is used to identify a unique instance of the model.
 */
export interface IDatabaseModel {
    _id: ObjectId | null;
}
