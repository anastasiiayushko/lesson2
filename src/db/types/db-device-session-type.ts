import {ObjectId} from "mongodb";

export type DbDeviceSessionType = {
    _id: ObjectId,
    ip: string, //IP address of device during signing in
    title: string, //Device name: for example Chrome 105
    lastActiveDate: Date, //Date of the last generating of refresh/access tokens (iat)
    deviceId: string, // Id of connected device session
    expirationDate: Date,
    userId: string,
}

export type DbDeviceSessionInputType = {
    ip: string, //IP address of device during signing in
    title: string, //Device name: for example Chrome 105
    lastActiveDate: string, //Date of the last generating of refresh/access tokens (iat)
    deviceId: string, // Id of connected device session
    expirationDate: string,
    userId: string,
}

export type DbDeviceSessionUpdateInputType = {
    // ip: string, //IP address of device during signing in
    // title: string, //Device name: for example Chrome 105
    lastActiveDate: Date, //Date of the last generating of refresh/access tokens (iat)
    deviceId: string, // Id of connected device session
    expirationDate: Date,
    userId: string,
}

