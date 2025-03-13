import {body} from 'express-validator';
import {LikeStatusEnum} from "../../like/domain/like.entity";


const contentValidate = body('content').isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("field is empty")
    .isLength({min: 20, max: 300}).withMessage("field contain min 20 and max 300 characters");


export const commentValidate =  [contentValidate]

export const likeStatusValidate = body('likeStatus').isString()
    .isIn(Object.values(LikeStatusEnum))
    .withMessage(`Status must be one of: ${Object.values(LikeStatusEnum).join(", ")}`)