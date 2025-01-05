import {BlogSchemaType} from "./types/db-blog-type";
import {Collection, Db, MongoClient} from "mongodb";
import {SETTINGS} from "../settings";
import {PostSchemaType} from "./types/db-post-type";
import {UserSchemaType} from "./types/db-user-type";



export const resetDB = async ():Promise<void> => {

    await blogCollection.drop();
    await postCollection.drop();
    await userCollection.drop();
}



const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL);
export const db: Db = client.db(SETTINGS.DATABASE_NAME);

// получение доступа к коллекциям
export const blogCollection: Collection<BlogSchemaType> = db.collection<BlogSchemaType>(SETTINGS.DB_COLLECTION_NAME.BLOGS);
export const postCollection: Collection<PostSchemaType> = db.collection<PostSchemaType>(SETTINGS.DB_COLLECTION_NAME.POSTS);
export const userCollection: Collection<UserSchemaType> = db.collection<UserSchemaType>(SETTINGS.DB_COLLECTION_NAME.USERS);

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