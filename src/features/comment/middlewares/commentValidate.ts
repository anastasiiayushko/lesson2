import {body} from 'express-validator';


const contentValidate = body('content').isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("field is empty")
    .isLength({min: 20, max: 300}).withMessage("field contain min 20 and max 300 characters");


export const commentValidate =  [contentValidate]