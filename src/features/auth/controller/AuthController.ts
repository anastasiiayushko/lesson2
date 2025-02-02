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

type LoginInputType = {
    loginOrEmail: string, password: string
}

export class AuthController {
    private readonly userService: UserService;
    private readonly userQueryRepository: UserQueryRepository;
    private readonly authRegService: AuthRegistrationService;
    private readonly tokenBlackListService: TokenBlackListService;

    constructor() {
        this.tokenBlackListService = new TokenBlackListService();
        this.userService = new UserService();
        this.userQueryRepository = new UserQueryRepository();
        this.authRegService = new AuthRegistrationService(new AuthRegSendEmailAdapter());

    }


    loginInSystem = async (req: Request<{}, {}, LoginInputType>, res: Response<any>) => {
        let refresh = req.cookies.refreshToken;
        let response = await this.userService.checkCredentialsUser(req.body.loginOrEmail, req.body.password);
        if (refresh) {
            await this.tokenBlackListService.setToken(refresh)
        }
        if (response.status !== StatusCode.OK_200 || !response.data) {
            res.sendStatus(StatusCode.UNAUTHORIZED_401);
            return;
        }

        let accessToken = await jwtService.createToken(response.data.userId, SETTINGS.JWT_AT_SECRET, SETTINGS.JWT_ACCESS_TIME);
        let refreshToken = await jwtService.createToken(response.data.userId, SETTINGS.JWT_RT_SECRET, SETTINGS.JWT_REFRESH_TIME);

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        res.status(StatusCode.OK_200).json({accessToken: accessToken});


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
    refreshToken = async (req:Request, res:Response) => {
        try {
            let refresh = req.cookies.refreshToken;
            if (!refresh) {
                res.status(StatusCode.UNAUTHORIZED_401).send();
                return;
            }

            let result = await this.tokenBlackListService.authenticateRefreshToken(refresh);
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
    logout = async (req:Request, res:Response) => {
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