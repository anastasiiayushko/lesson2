import {DeviceSessionsRepository} from "../repository/DeviceSessionsRepository";
import {ServiceResponseType} from "../../../types/service-response-type";
import {StatusCode} from "../../../types/status-code-types";
import {randomUUID} from "crypto";
import {jwtService} from "../../../app/jwtService";
import {injectable} from "inversify";


type AddingDeviceSessionResult = Promise<ServiceResponseType<{ accessToken: string, refreshToken: string }>>
type UpdateDeviceSessionResult = Promise<ServiceResponseType<{ accessToken: string, refreshToken: string } | null>>

type InputUpdateDeviceSessionType = {
    userId: string, deviceSessionId: string, deviceId: string, ip: string, userAgent: string
}

@injectable()
export class DeviceSessionsService {

    constructor(protected deviceSessionRepository: DeviceSessionsRepository) {}


    private async createTokenPairWithMetadata(userId: string, deviceId: string,): Promise<{
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
        const sessionMeta = await this.createTokenPairWithMetadata(userId, deviceId);

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

    async updateDevice({
                           userId,
                           deviceId,
                           ip,
                           userAgent
                       }: InputUpdateDeviceSessionType): UpdateDeviceSessionResult {

        const sessionMeta = await this.createTokenPairWithMetadata(userId, deviceId);
        await this.deviceSessionRepository.updateDeviceSessionById(
            {userId: userId, deviceId: deviceId},
            {
                expirationDate: sessionMeta.expirationDate,
                lastActiveDate: sessionMeta.lastActiveDate,
                ip: ip,
                title: userAgent
            }
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

    async deleteSessionDeviceById(deviceSessionId: string): Promise<ServiceResponseType<boolean>> {
        let result = await this.deviceSessionRepository.deleteSessionDeviceById(deviceSessionId);

        return {
            status: result ? StatusCode.OK_200 : StatusCode.UNAUTHORIZED_401,
            data: result,
            extensions: []
        }
    }


    public async verifyRefreshToken(token: string): Promise<ServiceResponseType<{
        userId: string,
        deviceSessionId: string, deviceId: string
    } | null>> {
        const verify = await jwtService.verifyRefreshToken(token);
        if (!verify) {
            return {
                status: StatusCode.UNAUTHORIZED_401,
                data: null,
                extensions: []
            }
        }
        const lastActiveDate = new Date(verify!.iat * 1000);
        let result = await this.deviceSessionRepository.findDeviceByMeta(verify.deviceId, verify.userId, lastActiveDate);

        return {
            status: result ? StatusCode.OK_200 : StatusCode.UNAUTHORIZED_401,
            data: result ? {
                userId: verify.userId,
                deviceSessionId: result._id.toString(),
                deviceId: result.deviceId
            } : null,
            extensions: []
        }
    }

    public async deleteByDeviceId(deviceId: string, userIdInSystem: string): Promise<ServiceResponseType<null>> {
        const device = await this.deviceSessionRepository.findDeviceSessionByDeviceId(deviceId);
        if (!device) {
            return {
                status: StatusCode.NOT_FOUND_404,
                data: null,
                extensions: []
            }
        }
        if (device.userId !== userIdInSystem) {
            return {
                status: StatusCode.FORBIDDEN_403,
                data: null,
                extensions: []
            }
        }

        await this.deviceSessionRepository.removeByDeviceId(deviceId, userIdInSystem);

        return {
            status: StatusCode.NO_CONTENT_204,
            data: null,
            extensions: []
        }
    }

    public async deleteAllOtherDeviceSessions(userId: string, deviceId: string): Promise<ServiceResponseType<null>> {

        await this.deviceSessionRepository.removeOtherDeviceSessionsByUserId(userId, deviceId);
        return {
            status: StatusCode.NO_CONTENT_204,
            data: null, extensions: []
        }

    }

}

