/**
 * A user represents a registration of a name/player key on the server
 */
import {IUserMongoSchema} from "./UserRepository";
import {ObjectID} from "bson";

export class User implements IUserMongoSchema {
    public _id: ObjectID | null;

    constructor(
        public readonly name: string,
        public readonly key: string
    ) {
        this._id = new ObjectID();
    }

    public static fromSchema(user: IUserMongoSchema) {
        const newUser = new User(user.name, user.key);
        newUser._id = user._id;
        return newUser;
    }
}