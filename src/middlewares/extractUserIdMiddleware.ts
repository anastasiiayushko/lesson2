import {jwtService} from "../app/jwtService";
import {Request, Response, NextFunction} from "express";

export const extractUserIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || '';

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded: any = await jwtService.decodeToken(token); // Используем decode без проверки подписи
            console.log(decoded, 'extractUserIdMiddleware');
            if (decoded && decoded.userId) {
                req.userId = decoded.userId; // Добавляем userId в req
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    next(); // Переходим дальше, даже если userId нет
};