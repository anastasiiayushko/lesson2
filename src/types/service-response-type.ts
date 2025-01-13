import {StatusCode} from "./status-code-types";
import {ErrorItemType} from "./output-error-types";

export type ServiceResponseType<T = null> = {
    status: StatusCode;
    errorMessage?: string;
    extensions: ErrorItemType[];
    data: T;
}