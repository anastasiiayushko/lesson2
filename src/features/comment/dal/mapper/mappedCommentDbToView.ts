import {CommentSchemaType} from "../../../../db/types/db-comments-type";
import {CommentViewModelType} from "../../core/type/input-outup-commets";

export const mappedCommentDbToView = (comment: CommentSchemaType): CommentViewModelType => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
    }
}