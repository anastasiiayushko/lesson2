import {BlogSchemaType, PostSchemaType} from "./db-types";
import {Collection, Db, MongoClient} from "mongodb";
import {SETTINGS} from "../settings";

export type DBType = {
    blogs: BlogSchemaType [],
    posts: PostSchemaType[]
}


export const resetDB = async ():Promise<void> => {

    await blogCollection.drop();
    await postCollection.drop();
}



const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL);
export const db: Db = client.db(SETTINGS.DATABASE_NAME);

// получение доступа к коллекциям
export const blogCollection: Collection<BlogSchemaType> = db.collection<BlogSchemaType>(SETTINGS.DB_COLLECTION_NAME.BLOGS);
export const postCollection: Collection<PostSchemaType> = db.collection<PostSchemaType>(SETTINGS.DB_COLLECTION_NAME.POSTS);

export const connectionDB = async (): Promise<boolean> => {
    try {
        await client.connect();
        console.log("Connected database...");
        return true
    } catch (error) {
        console.log("Unable to connect to database...");
        console.log(error);
        await client.close()
        return false
    }
}