import {body} from "express-validator";

const loginOrEmailValidate = body('login')
    .isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("field is empty")





const passwordValidate = body('password')
    .isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("filed is empty")

export const loginValidator = [loginOrEmailValidate, passwordValidate]