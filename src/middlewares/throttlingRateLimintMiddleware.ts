import {NextFunction, Request, Response} from "express";
import {StatusCode} from "../types/status-code-types";
import {ThrottlingRateRepository} from "../features/throttlingRate/repository/ThrottlingRateRepository";
// Лимит
const REQUEST_LIMIT = 5;

const throttlingRateRepository = new ThrottlingRateRepository();

export const throttlingRateLimitMiddleware =
    async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.headers['x-forwarded-for']
            ? (req.headers['x-forwarded-for'] as string).split(',')[0].trim()
            : req.socket.remoteAddress;
        const baseUrl = req.originalUrl;

        if (!ip) {
            res.sendStatus(StatusCode.BAD_REQUEST_400)
            return;
        }
        try {

            await throttlingRateRepository.logRequest(ip, baseUrl);
            const requestsInLast10Seconds = await throttlingRateRepository.countDocuments(ip, baseUrl);
            console.log(requestsInLast10Seconds);
            if (requestsInLast10Seconds > REQUEST_LIMIT) {
                res.sendStatus(StatusCode.MANY_REQUEST_429)
                return;
            }
            next();

        } catch (err) {
            res.sendStatus(StatusCode.MANY_REQUEST_429);
            return
        }

    }