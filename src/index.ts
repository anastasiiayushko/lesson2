import {SETTINGS} from "./settings";
import {app} from "./app";
import {connectionDB} from "./db/db";

app.listen(SETTINGS.PORT, async () => {
    console.info("Server started port", SETTINGS.PORT);
    await connectionDB()
});