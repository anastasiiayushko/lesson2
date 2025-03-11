import mongoose from "mongoose";

export class BaseModel {
    static  formatValidationError(error: unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
            return Object.keys(error.errors).map(field => ({
                field,
                message: error.errors[field].message
            }));
        }
        return [{ field: "unknown", message: "An unexpected error occurred" }];
    }
    static isMongooseValidationError(error: unknown): error is mongoose.Error.ValidationError {
        return error instanceof mongoose.Error.ValidationError;
    }

}