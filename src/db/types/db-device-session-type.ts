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
    ip: string,
    title: string,
    lastActiveDate: Date,
    deviceId: string,
    expirationDate: Date,
    userId: string,
}

export type DbDeviceSessionUpdateInputType = {
    lastActiveDate: Date,
    expirationDate: Date,
    ip: string,
    title: string,
}

