import {ObjectId} from "mongodb";

export type UserSchemaType = {
    _id: ObjectId
    login: string,
    email: string,
    createdAt: string,
    password: string,
    emailConfirmation: EmailConfirmationDbType
    recoveryPasswordConfirm: RecoveryPasswordConfirmDbType,
}

export type UserSchemaInputType = {
    login: string, // maxLength: 10 minLength: 3  pattern: ^[a-zA-Z0-9_-]*$ must be unique
    email: string, // 	 pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ example: example@example.com must be unique
    password: string, // maxLength: 20 minLength: 6
    createdAt: string,
    emailConfirmation: EmailConfirmationDbType
}

export type EmailConfirmationDbType = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}

export type RecoveryPasswordConfirmDbType = {
    recoveryCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}