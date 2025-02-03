import jwt, {JwtPayload} from "jsonwebtoken";



export const jwtService = {

    async createToken(userId: string, deviceId: string, secret:string, expiresIn:string): Promise<string> {
        return jwt.sign({userId, deviceId}, secret, {expiresIn: expiresIn})
    },
    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
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