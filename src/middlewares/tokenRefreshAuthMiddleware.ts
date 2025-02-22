import {NextFunction, Request, Response} from "express";
import {StatusCode} from "../types/status-code-types";
import {DeviceSessionsService} from "../features/sessions/service/DeviceSessionsService";
import {container} from "../inversify.config";


const deviceSessionsService = container.resolve(DeviceSessionsService);

export const tokenRefreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    let refreshToken = req.cookies.refreshToken;


    try {

        if (!refreshToken) {
            throw new Error(`${StatusCode.UNAUTHORIZED_401}`);
        }

        const result = await deviceSessionsService.verifyRefreshToken(refreshToken);
        if (result.status === StatusCode.UNAUTHORIZED_401 || !result.data) {
            throw new Error(`${StatusCode.UNAUTHORIZED_401}`);
        }

        req.userId = result!.data!.userId;
        // req.deviceSessionId = result.data.deviceSessionId;
        req.deviceId = result.data.deviceId;
        next();

    } catch (err) {
        req.userId = null;
        // req.deviceSessionId = null;
        req.deviceId = null;
        res.sendStatus(StatusCode.UNAUTHORIZED_401);
        return
    }


}