export type ErrorItemType = {
    message: string,
    field: string
}

export  type  ApiErrorResultType = {
    errorsMessages: ErrorItemType[] | null
}
