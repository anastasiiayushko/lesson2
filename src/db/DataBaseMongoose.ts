import * as mongoose from "mongoose";
import {Mongoose} from "mongoose";


class DataBaseMongoose {
    private static instance: DataBaseMongoose;

    constructor() {
        if (DataBaseMongoose.instance) {
            return DataBaseMongoose.instance;
        }

        DataBaseMongoose.instance = this;
    }

    async connect(url: string, dbName: string): Promise<Mongoose> {
        // console.log(
        //     "Connecting to database mongoose...",
        // )
        return await mongoose.connect(url, {dbName: dbName});
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }
}

export default DataBaseMongoose;
