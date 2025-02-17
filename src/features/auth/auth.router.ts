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

const authRouter = express.Router();

const authController = new AuthController();

//set login trotling ip
authRouter.post('/login', throttlingRateLimitMiddleware, loginValidator, validateInputMiddleware, authController.loginInSystem);
authRouter.get('/me', tokenAuthMiddleware, authController.authMe);

authRouter.post('/registration', throttlingRateLimitMiddleware, userValidateRegistration, validateInputMiddleware, authController.authRegistration);
authRouter.post('/registration-confirmation', throttlingRateLimitMiddleware, confirmCodeValidator, validateInputMiddleware, authController.authEmailConfirmed);
authRouter.post('/registration-email-resending', throttlingRateLimitMiddleware, authEmailValidator, validateInputMiddleware, authController.authEmailResending);

authRouter.post('/password-recovery', throttlingRateLimitMiddleware, authEmailValidator, validateInputMiddleware, authController.passwordRecovery.bind(authController));
authRouter.post('/new-password', throttlingRateLimitMiddleware, confirmRecoveryCodeValidator, newPasswordValidate, validateInputMiddleware, authController.updatePassword.bind(authController));

authRouter.post('/refresh-token', tokenRefreshAuthMiddleware, authController.refreshToken)
authRouter.post('/logout', tokenRefreshAuthMiddleware, authController.logout)
export default authRouter;
