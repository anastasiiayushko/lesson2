import {CreateCommentType} from "../../dal/CommentsRepository";

export default function createCommentDto(postId: string, userId: string, userLogin: string, commentBody: string): CreateCommentType {
    return {
        postId: postId,
        commentatorInfo: {
            userId: userId,
            userLogin: userLogin,
        },
        content: commentBody,
        createdAt: new Date().toISOString(),
    };
}