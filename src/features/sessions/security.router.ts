import express from "express";
import {DeviceSessionsController} from "./controller/DeviceSessionsController";
import {tokenRefreshAuthMiddleware} from "../../middlewares/tokenRefreshAuthMiddleware";
import {container} from "../../inversify.config";

const securityRouter = express.Router();

const deviceSessionController = container.resolve(DeviceSessionsController);

securityRouter.get('/devices', tokenRefreshAuthMiddleware, deviceSessionController.getAllDeviceSessions.bind(deviceSessionController));
securityRouter.delete('/devices', tokenRefreshAuthMiddleware, deviceSessionController.deleteAllOtherDeviceSessions.bind(deviceSessionController));
securityRouter.delete('/devices/:deviceId', tokenRefreshAuthMiddleware, deviceSessionController.deleteDeviceSessionByDeviceId.bind(deviceSessionController));

export default securityRouter;