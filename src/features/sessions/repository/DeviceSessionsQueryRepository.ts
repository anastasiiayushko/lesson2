import {deviceSessionsCollection} from "../../../db/db";
import {DeviceViewModel} from "../type/input-output-device-sessions";
import {mapSessionDeviceToView} from "./mapper/mapSessionDeviceToView";


export class DeviceSessionsQueryRepository {
    private db = deviceSessionsCollection;

    constructor() {
        this.getDeviceSessionsByUserId = this.getDeviceSessionsByUserId.bind(this);

    }

    async getDeviceSessionsByUserId(userId: string): Promise<DeviceViewModel[]> {
        const devices = await deviceSessionsCollection.find({userId: userId}).toArray();

        return devices.map(mapSessionDeviceToView)

    }


}