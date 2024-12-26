import {query} from "express-validator";

const blogQueryPageNumber = query("pageNumber")
    .optional()
    .isInt({min: 1})
    .withMessage('Page must be a positive integer')
    .default(1); // Set default value to 1 if no query parameter is provided

const blogQueryPageSize = query("pageSize")
    .optional()
    .isInt({min: 1})
    .withMessage('Page must be a positive integer')
    .default(10)

const blogQuerySortBy = query("sortBy")
    .optional()
    .isString()
    .trim()
    .default('createdAt')


const blogQuerySortDirection = query("sortDirection")
    .optional()
    .isString()
    .default('desc');


export const postQueryValidate = [blogQueryPageNumber, blogQueryPageSize, blogQuerySortBy, blogQuerySortDirection]