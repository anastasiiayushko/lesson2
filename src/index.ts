import {SETTINGS} from "./settings";
import {app} from "./app";
import {connectionDB} from "./db/db";
import DataBaseMongoose from "./db/DataBaseMongoose";


const startApp = async () => {
    console.info("Starting app...");
    const dbMongoose = new DataBaseMongoose();
    try {
        await connectionDB();
        await dbMongoose.connect(SETTINGS.MONGO_URL, SETTINGS.DATABASE_NAME);
        app.listen(SETTINGS.PORT, () => {
            console.log(`Example app listening on port ${SETTINGS.PORT}`)
        })
    } catch (err) {
        //@ts-ignore
        console.error(err.stack);

        await dbMongoose.disconnect();

    }
}

startApp()