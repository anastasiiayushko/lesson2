import {CommentViewModelType} from "../../core/type/input-outup-commets";
import {WithId} from "mongodb";
import {IComment} from "../../domain/comment-entity";
import {LikeStatusEnum} from "../../../like/domain/like.entity";


export const mappedCommentDbToView = (comment: WithId<IComment>, likeMyStatus: LikeStatusEnum): CommentViewModelType => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId.toString(),
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt.toISOString(),
        likesInfo:{
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: likeMyStatus
        }
    }
}