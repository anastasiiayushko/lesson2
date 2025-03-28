import {NextFunction, Request, Response} from "express";
import {StatusCode} from "../types/status-code-types";
import {jwtService} from "../app/jwtService";


export const tokenAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let authorization = req.headers['authorization'];

    try {

        if (!authorization || !authorization.includes("Bearer")) {
            throw new Error(`${StatusCode.UNAUTHORIZED_401}`)
        }

        let token = authorization.split(' ')?.[1];
        if (!token) {
            throw new Error(`${StatusCode.UNAUTHORIZED_401}`)
        }
        const decode = await jwtService.verifyAccessToken(token);

        if (!decode) {
            throw new Error(`${StatusCode.UNAUTHORIZED_401}`)
        }

        req.userId = decode!.userId;
        console.log('next')
        next();

    } catch (err) {
        req.userId = null;
        res.sendStatus(StatusCode.UNAUTHORIZED_401);
        return
    }


}