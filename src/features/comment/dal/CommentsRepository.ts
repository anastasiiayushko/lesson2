
import {CommentViewModelType} from "../core/type/input-outup-commets";

export type CreateCommentType = {
    postId: string,
    commentatorInfo: {
        userId: string,
        userLogin: string,
    }
    content: string,
    createdAt: string,
}


export interface CommentsRepository {

    createComment(dto: CreateCommentType): Promise<string>;

    updateComment(commentId: string, content: string ): Promise<boolean>;

    deleteComment(commentId: string): Promise<boolean>;

    getComment(commentId: string): Promise<CommentViewModelType | null>;
}
