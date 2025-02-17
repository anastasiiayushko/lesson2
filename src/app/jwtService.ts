import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";

type VerifyTokenAccessResultT = {userId:string} ;
type VerifyTokenRefreshResultT = {
    userId: string; deviceId: string, iat: number
}

export const jwtService = {
    async createAccessToken(userId: string): Promise<string> {
        return jwt.sign({userId}, SETTINGS.JWT_AT_SECRET, {expiresIn: SETTINGS.JWT_ACCESS_TIME})
    },
    async createRefreshToken(userId: string, deviceId: string): Promise<string> {
        return jwt.sign({userId, deviceId}, SETTINGS.JWT_RT_SECRET, {expiresIn: SETTINGS.JWT_REFRESH_TIME})
    },

    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token) ;
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyAccessToken(token: string): Promise<VerifyTokenAccessResultT | null> {
        try {
            return  jwt.verify(token, SETTINGS.JWT_AT_SECRET) as VerifyTokenAccessResultT;
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    },
    async verifyRefreshToken(token: string): Promise<VerifyTokenRefreshResultT | null> {
        try {
            return  jwt.verify(token, SETTINGS.JWT_RT_SECRET) as VerifyTokenRefreshResultT;
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    },
    async verifyToken(token: string, secret:string): Promise<{ userId: string, deviceId:string } | null> {
        try {
            return  jwt.verify(token, secret) as { userId: string, deviceId: string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    }


}