import {NextFunction, Request, Response} from "express";
import {StatusCode} from "../types/status-code-types";
import {jwtService} from "../app/jwtService";
import {UserQueryRepository} from "../features/user/dal/UserQueryRepository";
import {SETTINGS} from "../settings";
import {TokenBlackListRepository} from "../features/tokenBlackList/dal/tokenBlackListRepository";


const tokenBlackListRepository = new TokenBlackListRepository();

export const tokenAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let authorization = req.headers['authorization'];
    let refreshToken = req.cookies.refreshToken;

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
        console.log('---------------')
        console.log(token);
        const decode = await jwtService.verifyToken(token, SETTINGS.JWT_AT_SECRET);

        let isHasTokenBlack = await tokenBlackListRepository.findToken(refreshToken);
        console.log(isHasTokenBlack, decode)
        console.log('---------------')

        if(isHasTokenBlack || !decode){
            req.userId = null;
            res.status(StatusCode.UNAUTHORIZED_401).send()
            return;
        }

        // const user = await userQueryRepository.getUserById(decode!.userId);
        // if (!user) {
        //     req.userId = null;
        //     res.sendStatus(StatusCode.UNAUTHORIZED_401);
        //     return;
        // }
        // req.userId = '678e7675afe9e559f449c63b';
        req.userId = decode!.userId;
        next();

    } catch (err) {
        req.userId = null;
        res.sendStatus(StatusCode.UNAUTHORIZED_401);
        return
    }


}