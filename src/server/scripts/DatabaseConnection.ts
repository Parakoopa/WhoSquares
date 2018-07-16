import {Collection, Db, MongoClient} from "mongodb";

/**
 * A utility class that manages the database connection
 */
export class DatabaseConnection {

    private static readonly DB_HOST_DEFAULT = "127.0.0.1";
    private static readonly DB_NAME_DEFAULT = "whosquares";
    private static dbRef: Db = null;

    /**
     * Get the reference to the database. This establishes the connection if not already established.
     * @returns {Promise<Db>}
     */
    public static async db(): Promise<Db> {
        if (!this.dbRef) {
            try {
                const client = await MongoClient.connect("mongodb://" + this.getUrl() + ":27017", {
                    useNewUrlParser: true
                });

                this.dbRef = client.db(this.getDbName());
            } catch (ex) {
                console.error("COULD NOT CONNECT TO DB!");
                console.error(ex);
                process.exit(1);
            }
        }
        return this.dbRef;
    }

    /**
     * Get a collection by it's name
     * @param {string} name
     * @returns {Promise<Collection>}
     */
    public static async collection(name: string): Promise<Collection> {
        return (await this.db()).collection(name);
    }

    /**
     * Returns the database url. Will look in the envrionment variable DB_HOST
     * or return the default found in the constant
     * @returns {undefined}
     */
    private static getUrl(): string {
        const result = process.env.DB_HOST;
        if (result) {
            return result;
        }
        return this.DB_HOST_DEFAULT;
    }

    /**
     * Returns the database name. Will look in the envrionment variable DB_NAME
     * or return the default found in the constant
     * @returns {undefined}
     */
    private static getDbName(): string {
        const result = process.env.DB_NAME;
        if (result) {
            return result;
        }
        return this.DB_NAME_DEFAULT;
    }
}
