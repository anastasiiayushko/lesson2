import {Request, Response} from "express";
import {UserService} from "../../user/service/UserService";
import {StatusCode} from "../../../types/status-code-types";
import {jwtService} from "../../../app/jwtService";
import {UserQueryRepository} from "../../user/dal/UserQueryRepository";
import {AuthRegSendEmailAdapter} from "../adapter/AuthRegSendEmailAdapter";
import {AuthRegistrationService} from "../core/service/AuthRegistrationService";
import {UserInputModel} from "../../../types/input-output-types/user-types";
import {ApiErrorResultType} from "../../../types/output-error-types";
import {SETTINGS} from "../../../settings";
import {TokenBlackListService} from "../../tokenBlackList/service/tokenBlackListService";
import jwt from "jsonwebtoken";
import {randomUUID} from "crypto";
import {DeviceSessionsService} from "../../sessions/service/DeviceSessionsService";

type LoginInputType = {
    loginOrEmail: string, password: string
}

export class AuthController {
    private readonly userService: UserService;
    private readonly userQueryRepository: UserQueryRepository;
    private readonly authRegService: AuthRegistrationService;
    private readonly tokenBlackListService: TokenBlackListService;
    private readonly deviceSessionsService: DeviceSessionsService;

    constructor() {
        this.tokenBlackListService = new TokenBlackListService();
        this.userService = new UserService();
        this.userQueryRepository = new UserQueryRepository();
        this.authRegService = new AuthRegistrationService(new AuthRegSendEmailAdapter());
        this.deviceSessionsService = new DeviceSessionsService();

    }


    loginInSystem = async (req: Request<{}, {}, LoginInputType>, res: Response<any>) => {
        try {
            const ipExtractor = req.headers['x-forwarded-for']
                ? (req.headers['x-forwarded-for'] as string).split(',')[0].trim()
                : req.socket.remoteAddress;
            const userAgent = req.headers['user-agent']
            //::TODO какой код ошибки должен быть 400 || 403
            if (!ipExtractor) {
                res.sendStatus(StatusCode.BAD_REQUEST_400);
                return;
            }
            let resultUser = await this.userService.checkCredentialsUser(req.body.loginOrEmail, req.body.password);

            if (resultUser.status !== StatusCode.OK_200 || !resultUser.data) {
                res.sendStatus(StatusCode.UNAUTHORIZED_401);
                return;
            }

            let resultDeviceSession = await this.deviceSessionsService.addDevice(ipExtractor, userAgent!, resultUser.data.userId)

            res.cookie('refreshToken', resultDeviceSession.data.refreshToken, {httpOnly: true, secure: true,})
            res.status(StatusCode.OK_200).json({accessToken: resultDeviceSession.data.accessToken});

        } catch (e) {
            console.error(e);
            res.sendStatus(StatusCode.SERVER_ERROR);
        }

    }
    authMe = async (req: Request<{}, {}, LoginInputType>, res: Response<any>) => {
        let userId = req.userId;
        if (!userId) {
            res.sendStatus(StatusCode.UNAUTHORIZED_401);
            return;
        }
        let user = await this.userQueryRepository.getUserForAuthMe(userId)
        if (!user) {
            res.sendStatus(StatusCode.UNAUTHORIZED_401);
            return;
        }
        res.status(StatusCode.OK_200).json(user);

    }

    authRegistration = async (req: Request<{}, {}, UserInputModel>,
                              res: Response<ApiErrorResultType>) => {
        let userInput = req.body;
        let result = await this.authRegService.registration(userInput);
        if (result.extensions.length) {
            res.status(result.status).json({
                errorsMessages: result.extensions
            });
            return
        }
        res.sendStatus(StatusCode.NO_CONTENT_204);
    }

    authEmailConfirmed = async (req: Request<{}, {}, { code: string }>, res: Response<ApiErrorResultType>) => {
        let code = req.body.code;

        let result = await this.authRegService.registrationConfirmed(code);

        if (result.extensions.length || !result.data.isConfirmed) {
            res.status(result.status).json({errorsMessages: result.extensions});
            return;
        }
        res.status(StatusCode.NO_CONTENT_204).send();

    }

    authEmailResending = async (req: Request<{}, {}, { email: string }>, res: Response<ApiErrorResultType>) => {
        let email = req.body.email;
        let result = await this.authRegService.registrationEmailResending(email);
        if (result.extensions.length) {
            res.status(result.status).json({errorsMessages: result.extensions});
            return;
        }
        if (!result.data.isResending) {
            res.status(result.status).send();
            return;
        }
        res.status(StatusCode.NO_CONTENT_204).send();
    }
    refreshToken = async (req: Request, res: Response) => {
        try {
            let refresh = req.cookies.refreshToken;
            if (!refresh) {
                res.status(StatusCode.UNAUTHORIZED_401).send();
                return;
            }

            let result = await this.deviceSessionsService.updateDevice(refresh);
            // let result = await this.tokenBlackListService.authenticateRefreshToken(refresh);
            if (!result.data) {
                res.status(StatusCode.UNAUTHORIZED_401).send();
                return;
            }
            res.cookie('refreshToken', result.data.refreshToken, {httpOnly: true, secure: true,})
            res.status(StatusCode.OK_200).json({accessToken: result.data.accessToken});
        } catch (e) {
            res.status(StatusCode.UNAUTHORIZED_401).send();
        }
    }
    logout = async (req: Request, res: Response) => {
        let refresh = req.cookies.refreshToken;
        let isHasTokenBlack = await this.tokenBlackListService.findToken(refresh);
        if (isHasTokenBlack) {
            res.status(StatusCode.UNAUTHORIZED_401).send();
            return;
        }
        let decode = await jwtService.verifyToken(refresh, SETTINGS.JWT_RT_SECRET);
        if (!decode) {
            res.status(StatusCode.UNAUTHORIZED_401).send();
            return;
        }

        await this.tokenBlackListService.setToken(refresh);
        res.status(StatusCode.NO_CONTENT_204).send();
    }

}