import {deviceSessionsCollection} from "../../../db/db";
import {DbDeviceSessionInputType, DbDeviceSessionUpdateInputType} from "../../../db/types/db-device-session-type";


export class DeviceSessionsRepository {
    private db = deviceSessionsCollection;

    constructor() {
    }

    addDeviceSession = async (deviceSession: DbDeviceSessionInputType): Promise<string> => {
        let result = await this.db.insertOne(deviceSession)
        return result.insertedId.toString()
    }

    updateDeviceSession = async (deviceSession: DbDeviceSessionUpdateInputType): Promise<boolean> => {
        let result = await this.db.updateOne({
            deviceId: deviceSession.deviceId,
            userId: deviceSession.userId,
        }, {$set: {lastActiveDate: deviceSession.lastActiveDate, expirationDate: deviceSession.expirationDate}});
        return result.matchedCount > 0
    }
}