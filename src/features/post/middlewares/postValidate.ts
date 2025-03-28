import {body} from 'express-validator';
import {BlogRepository} from "../../blog/dal/blogRepository";


const titleValidate = body('title').isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("field is empty")
    .isLength({max: 30}).withMessage("field is too long. Max len 30 symbols");

const shortDescriptionValidate = body('shortDescription').isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("filed is empty")
    .isLength({max: 100}).withMessage("field is too long. Max len 100 symbols");


const contentValidate = body('content').isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("filed is empty")
    .isLength({max: 1000}).withMessage("field is too long. Max len 1000 symbols");

const blogIdValidate = body('blogId').isString().withMessage("filed to be string")
    .trim().notEmpty().withMessage("filed is empty")



export const postValidate = [titleValidate, shortDescriptionValidate, contentValidate, blogIdValidate];
export const postValidateWithoutBlogId = [
    titleValidate,
    shortDescriptionValidate,
    contentValidate,
];