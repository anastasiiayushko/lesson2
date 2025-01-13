import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || '12345678'

export const jwtService = {

    async createToken(userId: string): Promise<string> {
        return jwt.sign({userId}, SECRET, {expiresIn: '7d'})
    },
    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SECRET) as { userId: string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    }


}