import {Request, Response} from "express";
import {UserService} from "../../user/service/UserService";
import {StatusCode} from "../../../types/status-code-types";
import {jwtService} from "../../../app/jwtService";
import {UserQueryRepository} from "../../user/dal/UserQueryRepository";

type LoginInputType = {
    loginOrEmail: string, password: string
}

export class AuthController {
    private readonly userService: UserService;
    private readonly userQueryRepository: UserQueryRepository;

    constructor() {
        this.userService = new UserService();
        this.userQueryRepository = new UserQueryRepository();
    }


    loginInSystem = async (req: Request<{}, {}, LoginInputType>, res: Response<any>) => {
        let response = await this.userService.checkCredentialsUser(req.body.loginOrEmail, req.body.password);

        if (response.status !== StatusCode.OK_200 || !response.data) {
            res.sendStatus(StatusCode.UNAUTHORIZED_401);
            return;
        }

        let accessToken = await jwtService.createToken(response.data.userId);
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
}