export type DeviceSessionAddType = {
    ip: string, //IP address of device during signing in
    title: string, //Device name: for example Chrome 105
    // lastActiveDate: Date, //Date of the last generating of refresh/access tokens (iat)
    // deviceId: string, // Id of connected device session
    // expirationDate: Date,
    userId: string,
}
export type DeviceSessionUpdateType = {
    lastActiveDate: Date, //Date of the last generating of refresh/access tokens (iat)
    expirationDate: Date,
    userId: string,
    deviceId: string,
}