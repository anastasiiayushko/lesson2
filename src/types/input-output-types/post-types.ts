import {IPostNewestLikes} from "../../features/post/domain/post-types";
import {LikeStatusEnum} from "../../features/like/domain/like.entity";

export type PostViewModel = {
    id: string // maxLength: 30
    title: string
    shortDescription: string, //maxLength: 100
    content: string, //maxLength: 1000
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: keyof typeof LikeStatusEnum,
        newestLikes: IPostNewestLikes[],
    }
};

export type PostInputModel = {
    title: string
    shortDescription: string, //maxLength: 100
    content: string, //maxLength: 1000
    blogId: string,
}