import {Request, Response} from "express";
import {UserService} from "../../user/service/UserService";
import {ApiErrorResultType} from "../../../types/output-error-types";
import {StatusCode} from "../../../types/status-code-types";

type LoginInputType = {
    loginOrEmail: string, password: string
}

export class AuthController {
    private readonly _userService = new UserService();


    loginInSystem = async (req: Request<{}, {}, LoginInputType>, res: Response<ApiErrorResultType>) => {
        let response = await this._userService.checkCredentialsUser(req.body.loginOrEmail, req.body.password);


        if (response) {
            res.sendStatus(StatusCode.NO_CONTENT_204);
            return;
        }
        res.sendStatus(StatusCode.UNAUTHORIZED_401);

    }
}