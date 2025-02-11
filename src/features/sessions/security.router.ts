import express from "express";
import {DeviceSessionsController} from "./controller/DeviceSessionsController";
import {tokenRefreshAuthMiddleware} from "../../middlewares/tokenRefreshAuthMiddleware";
import {tokenAuthMiddleware} from "../../middlewares/tokenAuthMiddleware";

const securityRouter = express.Router();

const deviceSessionController = new DeviceSessionsController();

securityRouter.get('/devices', tokenRefreshAuthMiddleware, deviceSessionController.getAllDeviceSessions);
securityRouter.delete('/devices', tokenRefreshAuthMiddleware, deviceSessionController.deleteAllOtherDeviceSessions);
securityRouter.delete('/devices/:deviceId', tokenRefreshAuthMiddleware, deviceSessionController.deleteDeviceSessionByDeviceId);

export default securityRouter;