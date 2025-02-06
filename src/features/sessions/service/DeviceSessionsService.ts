import {DeviceSessionUpdateType,} from "../type/input-output-device-sessions";
import {DeviceSessionsRepository} from "../repository/DeviceSessionsRepository";
import {ServiceResponseType} from "../../../types/service-response-type";
import {StatusCode} from "../../../types/status-code-types";
import {randomUUID} from "crypto";
import {jwtService} from "../../../app/jwtService";


type AddingDeviceSessionResult = Promise<ServiceResponseType<{ accessToken: string, refreshToken: string }>>
type UpdateDeviceSessionResult = Promise<ServiceResponseType<{ accessToken: string, refreshToken: string } | null>>

export class DeviceSessionsService {
    private deviceSessionRepository: DeviceSessionsRepository;

    constructor() {
        this.deviceSessionRepository = new DeviceSessionsRepository();
    }


    async getSessionTokensAndMeta(userId: string, deviceId: string): Promise<{
        accessToken: string,
        refreshToken: string,
        lastActiveDate: Date,
        expirationDate: Date
    }> {
        const accessToken = await jwtService.createAccessToken(userId);
        const refreshToken = await jwtService.createRefreshToken(userId, deviceId);

        const decodeNew = await jwtService.decodeToken(refreshToken);
        const lastActiveDate = new Date(decodeNew.iat * 1000);
        const expirationDate = new Date(decodeNew.exp * 1000);
        return {
            accessToken: accessToken, refreshToken: refreshToken,
            lastActiveDate: lastActiveDate,
            expirationDate: expirationDate
        }
    }

    async addDevice(ip: string, userAgent: string, userId: string): AddingDeviceSessionResult {

        const deviceId = randomUUID();
        // const accessToken = await jwtService.createAccessToken(userId);
        // const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
        //
        // const decode = await jwtService.decodeToken(refreshToken);
        // const lastActiveDate = new Date(decode.iat * 1000);
        // const expirationDate = new Date(decode.exp * 1000);
        const sessionMeta = await this.getSessionTokensAndMeta(userId, deviceId);

        const newDeviceSession = {
            ip: ip,
            title: userAgent,
            lastActiveDate: sessionMeta.lastActiveDate,
            deviceId: deviceId,
            expirationDate: sessionMeta.expirationDate,
            userId: userId
        }

        await this.deviceSessionRepository.addDeviceSession(newDeviceSession);
        return {
            status: StatusCode.CREATED_201,
            data: {accessToken: sessionMeta.accessToken, refreshToken: sessionMeta.refreshToken},
            extensions: []

        }


    }

    updateDevice = async (token: string): UpdateDeviceSessionResult => {

        const decode = await jwtService.decodeToken(token);
        if (!decode) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                data: null,
                extensions: []
            }
        }
        const {userId, deviceId} = decode;
        const sessionMeta = await this.getSessionTokensAndMeta(userId, deviceId);


        await this.deviceSessionRepository.updateDeviceSession(
            {
                userId: userId,
                deviceId: deviceId,
                expirationDate: sessionMeta.expirationDate,
                lastActiveDate: sessionMeta.lastActiveDate
            },
        )
        return {
            status: StatusCode.NO_CONTENT_204,
            data: {
                refreshToken: sessionMeta.refreshToken,
                accessToken: sessionMeta.accessToken,
            },
            extensions: []
        }

    }
}