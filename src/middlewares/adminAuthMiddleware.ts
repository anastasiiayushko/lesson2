import {Request, Response, NextFunction} from "express";
import {StatusCode} from "../types/status-code-types";
import {SETTINGS} from "../settings";



export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let authorization = req.headers['authorization'];

    if (!authorization || !authorization.includes("Basic")) {
        res.sendStatus(StatusCode.UNAUTHORIZED_401);
        return;
    }
    let base64 = authorization.split(' ')?.[1]; //YWRtaW46cXdlcnR5
    let decode = Buffer.from(base64, 'base64').toString('utf8'); //admin:qwerty
    let admin = SETTINGS.ADMIN; // admin:qwerty
    if (decode !== admin) {
        res.sendStatus(StatusCode.UNAUTHORIZED_401)
        return;
    }

    // let [login, password] = decode?.split(':'); // [admin, qwerty]
    // let [adminLogin, adminPassword] = admin.split(':')
    // if (login !== adminLogin || password !== adminPassword) {
    //     res.sendStatus(StatusCode.UNAUTHORIZED_401)
    //     return;
    // }

    next();
}