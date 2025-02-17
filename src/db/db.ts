import {BlogSchemaType} from "./types/db-blog-type";
import {Collection, Db, MongoClient} from "mongodb";
import {SETTINGS} from "../settings";
import {PostSchemaType} from "./types/db-post-type";
import {UserSchemaType} from "./types/db-user-type";
import {CommentSchemaType} from "./types/db-comments-type";
import {DbDeviceSessionType} from "./types/db-device-session-type";
import {DbThrottlingRateType} from "./types/db-throttling-rate-type";
import {TokenBlacklistSchemaType} from "./types/db-token-black-list-type";


export const resetDB = async (): Promise<void> => {
    await blogCollection.drop();
    await postCollection.drop();
    await userCollection.drop();
    await commentCollection.drop();
    await tokenBlackListCollection.drop();
    await deviceSessionsCollection.drop();
    await throttlingRateCollection.drop();
}


const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL);
export const db: Db = client.db(SETTINGS.DATABASE_NAME);

// получение доступа к коллекциям
export const blogCollection: Collection<BlogSchemaType> = db.collection<BlogSchemaType>(SETTINGS.DB_COLLECTION_NAME.BLOGS);
export const postCollection: Collection<PostSchemaType> = db.collection<PostSchemaType>(SETTINGS.DB_COLLECTION_NAME.POSTS);
export const userCollection: Collection<UserSchemaType> = db.collection<UserSchemaType>(SETTINGS.DB_COLLECTION_NAME.USERS);
export const commentCollection: Collection<CommentSchemaType> = db.collection<CommentSchemaType>(SETTINGS.DB_COLLECTION_NAME.COMMENTS);
export const tokenBlackListCollection: Collection<TokenBlacklistSchemaType> = db.collection<TokenBlacklistSchemaType>(SETTINGS.DB_COLLECTION_NAME.TOKEN_BLACK_LIST);
// Тип без _id для создания новых документов
type DbDeviceSessionInsert = Omit<DbDeviceSessionType, "_id">;
export const deviceSessionsCollection: Collection<DbDeviceSessionInsert> = db.collection<DbDeviceSessionInsert>(SETTINGS.DB_COLLECTION_NAME.DEVICE_SESSIONS);
export const throttlingRateCollection: Collection<DbThrottlingRateType> = db.collection<DbThrottlingRateType>(SETTINGS.DB_COLLECTION_NAME.THROTTLING_RATE);

async function setupIndexes() {
    await db.collection(SETTINGS.DB_COLLECTION_NAME.THROTTLING_RATE).createIndex(
        { date: 1 },
        { expireAfterSeconds: 60 } // Удаление через 1 час 60*60 = 1hourse
    );
    console.log("TTL-индекс установлен");
}
export const connectionDB = async (): Promise<boolean> => {
    try {
        await client.connect();
        // await setupIndexes()
        console.log("Connected database...");
        return true
    } catch (error) {
        console.log("Unable to connect to database...");
        console.log(error);
        await client.close()
        return false
    }
}