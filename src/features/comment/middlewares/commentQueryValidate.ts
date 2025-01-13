import {query} from "express-validator";

const blogQueryPageNumber = query("pageNumber")
    .optional()
    .custom(value => {
        if (value && value !== undefined && (isNaN(value) || value < 1)) {
            throw new Error('Page number must be a number greater than or equal to 1');
        }
        return true;
    })
    .default(1); // Set default value to 1 if no query parameter is provided

const commentQueryPageSize = query("pageSize")
    .optional()
    .custom(value => {
        if (value && value !== undefined && (isNaN(value) || value < 1)) {
            throw new Error('Page number must be a number greater than or equal to 1');
        }
        return true;
    })
    .default(10)

const commentQuerySortBy = query("sortBy")
    .optional()
    .isString()
    .trim()
    .default('createdAt')


const commentQuerySortDirection = query("sortDirection")
    .optional()
    .isString()
    .default('desc');


export const commentsQueryValidate = [blogQueryPageNumber, commentQueryPageSize, commentQuerySortBy, commentQuerySortDirection]