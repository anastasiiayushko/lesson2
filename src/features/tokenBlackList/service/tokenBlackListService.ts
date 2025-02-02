import {TokenBlackListRepository} from "../dal/tokenBlackListRepository";
import {add} from "date-fns"
import {ServiceResponseType} from "../../../types/service-response-type";
import {StatusCode} from "../../../types/status-code-types";
import {jwtService} from "../../../app/jwtService";
import {SETTINGS} from "../../../settings";

type  ResultCheckRefreshTokenType = ServiceResponseType<{
    refreshToken: string
    accessToken: string
} | null>

export class TokenBlackListService {
    private tokenBlackListRepository: TokenBlackListRepository;

    constructor() {
        this.tokenBlackListRepository = new TokenBlackListRepository();
    }

    findToken = async (refreshToken: string): Promise<boolean> => {
        return await this.tokenBlackListRepository.findToken(refreshToken)
    }
    setToken = async (refreshToken: string): Promise<boolean> => {
        return await this.tokenBlackListRepository.setToken(refreshToken, add(new Date, {hours: 7}))
    }

    authenticateRefreshToken = async (rToken: string): Promise<ResultCheckRefreshTokenType> => {
        let isHasTokenBlackList = await this.tokenBlackListRepository.findToken(rToken);
        if (isHasTokenBlackList) {
            return {
                data: null,
                status: StatusCode.UNAUTHORIZED_401,
                extensions: []
            }
        }

        let decode = await jwtService.verifyToken(rToken, SETTINGS.JWT_RT_SECRET);
        if (!decode) {
            return {
                data: null,
                status: StatusCode.UNAUTHORIZED_401,
                extensions: []
            }
        }

        await this.tokenBlackListRepository.setToken(rToken, add(new Date(), {hours: 24}));
        let accessToken = await jwtService.createToken(decode!.userId, SETTINGS.JWT_AT_SECRET, '1m');
        let refreshToken = await jwtService.createToken(decode!.userId, SETTINGS.JWT_RT_SECRET, '10m');

        return {
            status: StatusCode.NO_CONTENT_204,
            data: {
                accessToken: accessToken, refreshToken: refreshToken
            }, extensions: []
        }
    }
}