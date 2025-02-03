import {DeviceSessionUpdateType,} from "../type/input-output-device-sessions";
import {DeviceSessionsRepository} from "../repository/DeviceSessionsRepository";
import {ServiceResponseType} from "../../../types/service-response-type";
import {StatusCode} from "../../../types/status-code-types";
import {randomUUID} from "crypto";
import {jwtService} from "../../../app/jwtService";
import {SETTINGS} from "../../../settings";
import {format} from "date-fns";

type AddingDeviceSessionResult = Promise<ServiceResponseType<{ accessToken: string, refreshToken: string } | null>>
type UpdateDeviceSessionResult = Promise<ServiceResponseType<boolean | null>>

export class DeviceSessionsService {
    private deviceSessionRepository: DeviceSessionsRepository;

    constructor() {
        this.deviceSessionRepository = new DeviceSessionsRepository();
    }

    addDevice = async (ip: string, userAgent: string, userId: string): AddingDeviceSessionResult => {
        try {
            let deviceId = randomUUID();
            let accessToken = await jwtService.createToken(userId, deviceId, SETTINGS.JWT_AT_SECRET, SETTINGS.JWT_ACCESS_TIME);
            let refreshToken = await jwtService.createToken(userId, deviceId, SETTINGS.JWT_RT_SECRET, SETTINGS.JWT_REFRESH_TIME);

            let decode = await jwtService.decodeToken(refreshToken);
            let lastActiveDate = format(new Date(decode.iat * 1000), "yyyy-MM-dd'T'HH:mm:ssXXX");
            let expirationDate = format(new Date(decode.exp * 1000), "yyyy-MM-dd'T'HH:mm:ssXXX");

            let newDeviceSession = {
                ip: ip,
                title: userAgent,
                lastActiveDate: lastActiveDate,
                deviceId: deviceId,
                expirationDate: expirationDate,
                userId: userId
            }

            await this.deviceSessionRepository.addDeviceSession(newDeviceSession);
            return {
                status: StatusCode.CREATED_201,
                data: {accessToken: accessToken, refreshToken: refreshToken},
                extensions: []

            }

        } catch (e) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                data: null,
                extensions: [{field: "device", message: "bad request"}],
                // errorMessage:
            }
        }

    }
    updateDevice = async (deviceSession: DeviceSessionUpdateType): UpdateDeviceSessionResult => {
        try {

            let result = await this.deviceSessionRepository.updateDeviceSession(deviceSession);
            if (result) {
                return {
                    status: StatusCode.NO_CONTENT_204,
                    data: true,
                    extensions: []
                }
            }
            return {
                status: StatusCode.NOT_FOUND_404,
                data: false,
                extensions: []
            }
        } catch (e) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                data: null,
                extensions: []
            }
        }
    }
}