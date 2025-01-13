import {NextFunction, Request, Response} from "express";
import {StatusCode} from "../types/status-code-types";
import {jwtService} from "../app/jwtService";
import {UserQueryRepository} from "../features/user/dal/UserQueryRepository";

const userQueryRepository = new UserQueryRepository();

export const tokenAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let authorization = req.headers['authorization'];

    if (!authorization || !authorization.includes("Bearer")) {
        req.userId = null
        res.sendStatus(StatusCode.UNAUTHORIZED_401);
        return;
    }
    let token = authorization.split(' ')?.[1];
    if (!token) {
        req.userId = null
        res.sendStatus(StatusCode.UNAUTHORIZED_401);
        return;
    }
    try {
        const decode = await jwtService.decodeToken(token);

        const user = await userQueryRepository.getUserById(decode.userId);
        if (!user) {
            req.userId = null;
            res.sendStatus(StatusCode.UNAUTHORIZED_401);
            return;
        }
        req.userId = decode.userId;
        next();

    } catch (err) {
        req.userId = null;
        res.sendStatus(StatusCode.UNAUTHORIZED_401);
        return
    }


}