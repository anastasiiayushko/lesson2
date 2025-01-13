import express from "express";
import {AuthController} from "./controller/AuthController";
import {tokenAuthMiddleware} from "../../middlewares/tokenAuthMiddleware";
import {loginValidator} from "./middlewares/authValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";

const authRouter = express.Router();

const authController = new AuthController();
authRouter.post('/login', loginValidator, validateInputMiddleware, authController.loginInSystem);
authRouter.get('/me', tokenAuthMiddleware, authController.authMe);

export default authRouter;
