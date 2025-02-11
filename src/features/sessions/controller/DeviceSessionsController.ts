import {Request, Response} from 'express';
import {DeviceSessionsService} from "../service/DeviceSessionsService";
import {StatusCode} from "../../../types/status-code-types";
import {DeviceSessionsQueryRepository} from "../repository/DeviceSessionsQueryRepository";

export class DeviceSessionsController {
    private deviceSessionService: DeviceSessionsService;
    private deviceSessionsQueryRepository: DeviceSessionsQueryRepository;

    constructor() {
        this.deviceSessionService = new DeviceSessionsService();
        this.deviceSessionsQueryRepository = new DeviceSessionsQueryRepository();

        this.deleteDeviceSessionByDeviceId = this.deleteDeviceSessionByDeviceId.bind(this);
        this.getAllDeviceSessions = this.getAllDeviceSessions.bind(this);
        this.deleteAllOtherDeviceSessions = this.deleteAllOtherDeviceSessions.bind(this);
    }

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