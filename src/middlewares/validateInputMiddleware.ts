import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import {StatusCode} from "../types/status-code-types";
import {ApiErrorResultType, ErrorFieldType} from "../types/output-error-types";


export const validateInputMiddleware = (req: Request, res: Response<ApiErrorResultType>, next: NextFunction) => {
    const validateErrors = validationResult(req);
    if (!validateErrors.isEmpty()) {
        let errorArr = validateErrors.array({onlyFirstError: true}) as { path: ErrorFieldType, msg: string }[]
        let errorsMessages = errorArr?.map(item => ({
            field: item.path,
            message: item.msg
        }))
        res.status(StatusCode.BAD_REQUEST_400).json({errorsMessages});
        return
    }
    next();
}