import {deviceSessionsCollection} from "../../../db/db";
import {
    DbDeviceSessionInputType,
    DbDeviceSessionType,
    DbDeviceSessionUpdateInputType
} from "../../../db/types/db-device-session-type";
import {ObjectId} from "mongodb";
import {DeviceCommandModel} from "../type/input-output-device-sessions";
import {mapDbDeviceSessionToCommand} from "./mapper/mapDbDeviceSessionToCommand";
import {injectable} from "inversify";


type FilterUpdateSession = {
    userId: string, deviceId: string
}

@injectable()
export class DeviceSessionsRepository {
    private db = deviceSessionsCollection;

    constructor() {
        this.db = deviceSessionsCollection;
    }

    async addDeviceSession(deviceSession: DbDeviceSessionInputType): Promise<string> {
        let result = await this.db.insertOne(deviceSession)
        return result.insertedId.toString()
    }

    async updateDeviceSessionById(filter: FilterUpdateSession, updateDeviceSession: DbDeviceSessionUpdateInputType): Promise<boolean> {
        let result = await this.db.updateOne({
            userId: filter.userId,
            deviceId: filter.deviceId,

        }, {
            $set: {
                lastActiveDate: updateDeviceSession.lastActiveDate,
                expirationDate: updateDeviceSession.expirationDate,
                ip: updateDeviceSession.ip,
                title: updateDeviceSession.title
            }
        });

        return !!result
    }

    async deleteSessionDeviceById(deviceSessionId: string): Promise<boolean> {
        let result = await this.db.deleteOne({_id: new ObjectId(deviceSessionId)});
        return result.deletedCount > 0;
    }

    async findDeviceByMeta(deviceId: string, userId: string, lastActiveDate: Date): Promise<DbDeviceSessionType | null> {
        let result = await this.db.findOne({deviceId: deviceId, userId: userId, lastActiveDate: lastActiveDate});
        return result;

    }

    async findDeviceSessionByDeviceId(deviceId: string): Promise<DeviceCommandModel | null> {

        const deviceSession = await this.db.findOne({deviceId: deviceId});
        return deviceSession ? mapDbDeviceSessionToCommand(deviceSession) : null
    }

    async removeOtherDeviceSessionsByUserId(userId: string, deviceId: string): Promise<boolean> {

        const result = await this.db.deleteMany({
            userId: userId,
            deviceId: {$ne: deviceId},
        });
        return !!result
    }

    async removeByDeviceId(deviceId: string, userId: string): Promise<boolean> {
        const result = await this.db.deleteOne({deviceId: deviceId, userId: userId});
        return !!result
    }
}