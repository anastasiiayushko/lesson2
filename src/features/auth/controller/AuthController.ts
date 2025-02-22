import {Request, Response} from "express";
import {UserService} from "../../user/service/UserService";
import {StatusCode} from "../../../types/status-code-types";
import {UserQueryRepository} from "../../user/dal/UserQueryRepository";
import {AuthRegistrationService} from "../core/service/AuthRegistrationService";
import {UserInputModel} from "../../../types/input-output-types/user-types";
import {ApiErrorResultType} from "../../../types/output-error-types";
import {DeviceSessionsService} from "../../sessions/service/DeviceSessionsService";
import {AuthPasswordService} from "../core/service/AuthPasswordService";
import {injectable} from "inversify";

type LoginInputType = {
    loginOrEmail: string, password: string
}


@injectable()
export class AuthController {

    constructor(protected userService: UserService,
                protected authPasswordService: AuthPasswordService,
                protected userQueryRepository: UserQueryRepository,
                protected authRegistrationService: AuthRegistrationService,
                protected deviceSessionsService: DeviceSessionsService,
    ) {}


    private getMetaAgent(req: Request): { ip: string | undefined, userAgent: string } {
        const ip = req.headers['x-forwarded-for']
            ? (req.headers['x-forwarded-for'] as string).split(',')[0].trim()
            : req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'incognita';


        return {
            ip: ip, userAgent: userAgent,
        }
    }

    async loginInSystem(req: Request<{}, {}, LoginInputType>, res: Response<any>) {
        try {
            const meteHeader = this.getMetaAgent(req);

            if (!meteHeader.ip) {
                res.sendStatus(StatusCode.BAD_REQUEST_400);
                return
            }
            const resultUser = await this.userService.checkCredentialsUser(req.body.loginOrEmail, req.body.password);
            if (resultUser.status !== StatusCode.OK_200 || !resultUser.data) {
                res.sendStatus(StatusCode.UNAUTHORIZED_401);
                return;
            }
            const userId = resultUser.data.userId

            let resultDeviceSession = await this.deviceSessionsService.addDevice(meteHeader.ip, meteHeader.userAgent, userId)

            res.cookie('refreshToken', resultDeviceSession.data.refreshToken, {httpOnly: true, secure: true,})
            res.status(StatusCode.OK_200).json({accessToken: resultDeviceSession.data.accessToken});

        } catch (e) {
            console.error(e);
            res.sendStatus(StatusCode.SERVER_ERROR);
        }

    }

    public async authMe(req: Request<{}, {}, LoginInputType>, res: Response<any>) {
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

    public async authRegistration(req: Request<{}, {}, UserInputModel>,
                                  res: Response<ApiErrorResultType>) {
        let userInput = req.body;
        let result = await this.authRegistrationService.registration(userInput);
        if (result.extensions.length) {
            res.status(result.status).json({
                errorsMessages: result.extensions
            });
            return
        }
        res.sendStatus(StatusCode.NO_CONTENT_204);
    }

    public async authEmailConfirmed(req: Request<{}, {}, { code: string }>, res: Response<ApiErrorResultType>) {
        let code = req.body.code;

        let result = await this.authRegistrationService.registrationConfirmed(code);

        if (result.extensions.length || !result.data.isConfirmed) {
            res.status(result.status).json({errorsMessages: result.extensions});
            return;
        }
        res.status(StatusCode.NO_CONTENT_204).send();

    }

    public async authEmailResending(req: Request<{}, {}, { email: string }>, res: Response<ApiErrorResultType>) {
        let email = req.body.email;
        let result = await this.authRegistrationService.registrationEmailResending(email);
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

    public async refreshToken(req: Request, res: Response) {
        try {
            const meteHeader = this.getMetaAgent(req);

            if (!meteHeader.ip) {
                res.sendStatus(StatusCode.BAD_REQUEST_400);
                return;
            }
            const userId = req!.userId as string;
            const deviceSessionId = req!.deviceSessionId as string;
            const deviceId = req!.deviceId as string;

            let result = await this.deviceSessionsService.updateDevice({
                userId,
                deviceSessionId,
                deviceId,
                ip: meteHeader.ip,
                userAgent: meteHeader.userAgent
            });

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

    public async logout(req: Request, res: Response) {
        const userId = req.userId as string;
        const deviceId = req.deviceId as string;
        await this.deviceSessionsService.deleteByDeviceId(deviceId, userId);
        res.clearCookie('refreshToken');
        res.status(StatusCode.NO_CONTENT_204).send();
    }

    public async passwordRecovery(req: Request, res: Response) {
        try {
            const email = req.body.email;
            await this.authPasswordService.passwordRecovery(email);
            res.sendStatus(StatusCode.NO_CONTENT_204);
        } catch (e) {
            res.sendStatus(StatusCode.NO_CONTENT_204);
        }
    }

    public async updatePassword(req: Request, res: Response) {
        try {
            const recoveryCode = req.body.recoveryCode;
            const password = req.body.newPassword;
            const result = await this.authPasswordService.changePassword(password, recoveryCode);
            console.log(result);
            res.sendStatus(result.status);
        } catch (e) {

        }
    }
}