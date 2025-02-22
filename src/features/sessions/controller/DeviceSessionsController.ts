import {Request, Response} from 'express';
import {DeviceSessionsService} from "../service/DeviceSessionsService";
import {StatusCode} from "../../../types/status-code-types";
import {DeviceSessionsQueryRepository} from "../repository/DeviceSessionsQueryRepository";
import {injectable} from "inversify";

@injectable()
export class DeviceSessionsController {

    constructor(protected deviceSessionService: DeviceSessionsService, protected deviceSessionsQueryRepository: DeviceSessionsQueryRepository) {}

    async getAllDeviceSessions(req: Request, res: Response) {
        try {
            const userId = req!.userId as string;

            const devicesResult = await this.deviceSessionsQueryRepository.getDeviceSessionsByUserId(userId);
            res.status(StatusCode.OK_200).jsonp(devicesResult);

        } catch (e) {
            console.error(e);
            res.sendStatus(StatusCode.SERVER_ERROR);
        }
    }

    async deleteAllOtherDeviceSessions(req: Request, res: Response) {
        try {
            const userId = req!.userId as string;
            const deviceId = req!.deviceId as string;
            const result = await this.deviceSessionService.deleteAllOtherDeviceSessions(userId, deviceId);
            res.sendStatus(result.status);
        } catch (e) {
            console.error(e);
            res.sendStatus(StatusCode.SERVER_ERROR);
        }
    }

    async deleteDeviceSessionByDeviceId(req: Request<{ deviceId: string }>, res: Response) {
        try {
            const deviceId = req.params.deviceId as string;
            const userId = req!.userId as string;
            const result = await this.deviceSessionService.deleteByDeviceId(deviceId, userId);

            res.sendStatus(result.status);
        } catch (e) {
            console.error(e);
            res.sendStatus(StatusCode.SERVER_ERROR);
        }
    }
}