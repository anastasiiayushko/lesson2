export enum StatusCode {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    NOT_FOUND_404 = 404,
    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 = 401,
    FORBIDDEN_403 = 403,
    NOT_FOUND__404 = 404,
    SERVER_ERROR = 500,
    MANY_REQUEST_429 = 429
}

export const isStatusNotFound = (statusCode: StatusCode): statusCode is StatusCode.NOT_FOUND_404 => {
    return statusCode === StatusCode.NOT_FOUND_404;
}

export const isStatusNoContent = (statusCode: StatusCode): statusCode is StatusCode.NO_CONTENT_204 => {
    return statusCode === StatusCode.NO_CONTENT_204;
}

export const isStatusOk = (statusCode: StatusCode): statusCode is StatusCode.OK_200 => {
    return statusCode === StatusCode.OK_200;
}

export const isStatusCreated = (statusCode: StatusCode): statusCode is StatusCode.CREATED_201 => {
    return statusCode === StatusCode.CREATED_201;
}
export const isStatusBadRequest = (statusCode: StatusCode): statusCode is StatusCode.BAD_REQUEST_400 => {
    return statusCode === StatusCode.BAD_REQUEST_400;
}