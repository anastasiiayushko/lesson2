import {BlogInputModel} from "./input-output-types/blog-types";

export type ErrorItemType = {
    message: string,
    field: string
}

export  type  ApiErrorResultType = {
    errorsMessages: ErrorItemType[] | null
}
export type ErrorFieldType = keyof BlogInputModel;