import express from "express";
import {AuthController} from "./controller/AuthController";
import {tokenAuthMiddleware} from "../../middlewares/tokenAuthMiddleware";
import {
    authEmailValidator,
    confirmCodeValidator,
    confirmRecoveryCodeValidator,
    loginValidator, newPasswordValidate,
} from "./middlewares/authValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {userValidateRegistration} from "../user/middlewares/userValidate";
import {tokenRefreshAuthMiddleware} from "../../middlewares/tokenRefreshAuthMiddleware";
import {throttlingRateLimitMiddleware} from "../../middlewares/throttlingRateLimintMiddleware";
import {container} from "../../inversify.config";

const authRouter = express.Router();

const authController = container.resolve(AuthController);

//set login trotling ip
authRouter.post('/login', throttlingRateLimitMiddleware, loginValidator, validateInputMiddleware, authController.loginInSystem.bind(authController));
authRouter.get('/me', tokenAuthMiddleware, authController.authMe.bind(authController));

authRouter.post('/registration', throttlingRateLimitMiddleware, userValidateRegistration, validateInputMiddleware, authController.authRegistration.bind(authController));
authRouter.post('/registration-confirmation', throttlingRateLimitMiddleware, confirmCodeValidator, validateInputMiddleware, authController.authEmailConfirmed.bind(authController));
authRouter.post('/registration-email-resending', throttlingRateLimitMiddleware, authEmailValidator, validateInputMiddleware, authController.authEmailResending.bind(authController));

authRouter.post('/password-recovery', throttlingRateLimitMiddleware, authEmailValidator, validateInputMiddleware, authController.passwordRecovery.bind(authController));
authRouter.post('/new-password', throttlingRateLimitMiddleware, confirmRecoveryCodeValidator, newPasswordValidate, validateInputMiddleware, authController.updatePassword.bind(authController));

authRouter.post('/refresh-token', tokenRefreshAuthMiddleware, authController.refreshToken)
authRouter.post('/logout', tokenRefreshAuthMiddleware, authController.logout)
export default authRouter;
