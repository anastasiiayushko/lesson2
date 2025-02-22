import {deviceSessionsCollection} from "../../../db/db";
import {DeviceViewModel} from "../type/input-output-device-sessions";
import {mapSessionDeviceToView} from "./mapper/mapSessionDeviceToView";
import {injectable} from "inversify";


@injectable()
export class DeviceSessionsQueryRepository {
    constructor() {}

    async getDeviceSessionsByUserId(userId: string): Promise<DeviceViewModel[]> {
        const devices = await deviceSessionsCollection.find({userId: userId}).toArray();

        return devices.map(mapSessionDeviceToView)

    }


}