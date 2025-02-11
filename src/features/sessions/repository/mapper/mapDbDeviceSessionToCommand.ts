import {DbDeviceSessionType} from "../../../../db/types/db-device-session-type";
import {DeviceCommandModel} from "../../type/input-output-device-sessions";


export const mapDbDeviceSessionToCommand  = (device: DbDeviceSessionType): DeviceCommandModel => {
    return {
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate,
        deviceId: device.deviceId,
        userId: device.userId,
        id: device._id.toString()
    }
}