import {query} from "express-validator";

const userQueryPageNumber = query("pageNumber")
    .optional()
    .custom(value => {
        if (value && value !== undefined && (isNaN(value) || value < 1)) {
            throw new Error('Page number must be a number greater than or equal to 1');
        }
        return true;
    })
    .default(1); // Set default value to 1 if no query parameter is provided

const userQueryPageSize = query("pageSize")
    .optional()
    .custom(value => {
        if (value && value !== undefined && (isNaN(value) || value < 1)) {
            throw new Error('Page number must be a number greater than or equal to 1');
        }
        return true;
    })
    .default(10)

const userQuerySortBy = query("sortBy")
    .optional()
    .isString()
    .trim()
    .default('createdAt')


const userQuerySortDirection = query("sortDirection")
    .optional()
    .isString()
    .default('desc');

const userQuerySearchEmailTerm = query("searchEmailTerm")
    .optional()
    .isString()
    .default('');

const userQuerySearchLoginTerm = query("searchLoginTerm")
    .optional()
    .isString()
    .default('');

export const userQueryValidate = [userQueryPageSize, userQueryPageNumber, userQuerySortBy, userQuerySortDirection, userQuerySearchEmailTerm, userQuerySearchLoginTerm];

