import {Schema} from "mongoose";
import {LikeStatusEnum} from "../../like/domain/like.entity";

export interface IPostDB {
    title: string;
    shortDescription: string, //maxLength: 100
    content: string, //maxLength: 1000
    blogId: Schema.Types.ObjectId,
    blogName: string,
    createdAt: Date,
    extendedLikesInfo: IPostExtendedLikesInfo
}
export interface IPostExtendedLikesInfo{
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusEnum;
    newestLikes: IPostNewestLikes[],
}
export interface IPostNewestLikes{
    addedAt: string,
    userId:  string,
    login: string,
}