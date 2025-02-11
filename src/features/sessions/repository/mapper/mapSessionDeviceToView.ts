import {DbDeviceSessionType} from "../../../../db/types/db-device-session-type";
import {DeviceViewModel} from "../../type/input-output-device-sessions";

export const mapSessionDeviceToView = (device:DbDeviceSessionType):DeviceViewModel=>{
    return {
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate.toISOString(),
        deviceId: device.deviceId
    }
}
export const mapSessionDeviceToFull = (device:DbDeviceSessionType):DeviceViewModel=>{
    return {
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate.toISOString(),
        deviceId: device.deviceId
    }
}