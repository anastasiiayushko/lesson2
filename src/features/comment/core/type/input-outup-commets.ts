import {LikeStatusEnum} from "../../../like/domain/like.entity";

export type CommentViewModelType = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfoViewType,
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatusEnum
    }
}


export type CommentatorInfoViewType = {
    userId: string,
    userLogin: string,
}