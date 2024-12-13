import {body} from 'express-validator';

const blogValidateName = body('name')
    .trim()
    .notEmpty().withMessage('The name field is required and cannot be empty')
    .isString().withMessage('The name field should be a string')

    .isLength({max: 15}).withMessage('The name should not exceed 15 characters');

const blogValidateDescription = body('description').isString().withMessage("Should be string")
    .trim().notEmpty().isLength({max: 500}).withMessage("Should be not empty or max length  no more 500 symbol");

const blogValidateWebsiteUrl = body('websiteUrl')
    .isString().withMessage('not string')
    .trim().isURL({
        protocols: ['https']
    }).withMessage('not correct url')
    .isLength({min: 1, max: 100}).withMessage('more then 100 or 0')

export const bodyValidate = [
    blogValidateName,
    blogValidateDescription,
    blogValidateWebsiteUrl
]