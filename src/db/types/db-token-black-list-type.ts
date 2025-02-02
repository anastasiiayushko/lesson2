import {ObjectId} from "mongodb";

export type TokenBlacklistSchemaType = {
    _id: ObjectId
    token: string,
    expiresAt: Date,
}
// export type TokenBlacklistInput = {
//     _id: ObjectId
//     token: string,
//     expiresAt: Date,
// }