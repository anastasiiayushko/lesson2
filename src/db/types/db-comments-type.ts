import {ObjectId} from "mongodb";

export type CommentatorInfoSchemaType = {
    userId: string,
    userLogin: string,
}
export type CommentSchemaType = {
    _id: ObjectId;
    content: string;
    commentatorInfo: CommentatorInfoSchemaType,
    createdAt: string;
    postId: string;
}