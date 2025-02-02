import express from "express";
import {AuthController} from "./controller/AuthController";
import {tokenAuthMiddleware} from "../../middlewares/tokenAuthMiddleware";
import {authEmailValidator, confirmCodeValidator, loginValidator} from "./middlewares/authValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {userValidateRegistration} from "../user/middlewares/userValidate";

const authRouter = express.Router();

const authController = new AuthController();


authRouter.post('/login', loginValidator, validateInputMiddleware, authController.loginInSystem);
authRouter.get('/me', tokenAuthMiddleware, authController.authMe);

authRouter.post('/registration', userValidateRegistration, validateInputMiddleware, authController.authRegistration);
authRouter.post('/registration-confirmation', confirmCodeValidator, validateInputMiddleware, authController.authEmailConfirmed);
authRouter.post('/registration-email-resending', authEmailValidator, validateInputMiddleware, authController.authEmailResending);

authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/logout', authController.logout)
export default authRouter;
