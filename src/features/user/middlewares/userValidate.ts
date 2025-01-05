import {body} from 'express-validator';


const loginValidate = body('login')
    .isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("field is empty")
    .isLength({min: 3, max: 10}).withMessage("field to be contain min 3 and max 10 symbols")
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Field must contain only letters, numbers, underscores, or dashes');


const emailValidate = body('email')
    .trim().notEmpty().withMessage("filed is empty")
    .isEmail().withMessage("Invalid email format. Example: example@example.com")


const passwordValidate = body('password')
    .isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("filed is empty")
    .isLength({min: 6, max: 20}).withMessage("field to be contain min 6 and max 20 symbols")



export const userValidate = [loginValidate, emailValidate, passwordValidate]

