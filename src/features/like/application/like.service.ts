import {injectable} from "inversify";
import {likeModel, LikeStatusEnum} from "../domain/like.entity";


@injectable()
export class LikeService {
    constructor() {
    }

    async findAuthLikeStatusByParent (authorId: string, parentId: string): Promise<LikeStatusEnum> {
        const like = await likeModel.findOne({authorId: authorId, parentId: parentId}).lean();

        return like?.status ?? LikeStatusEnum.None
    }

    async calculateLikeStatusByParentId(parentId: string) {
        const likesCount = await likeModel.find({parentId: parentId, status: LikeStatusEnum.Like}).lean();
        const dislikesCount = await likeModel.find({parentId: parentId, status: LikeStatusEnum.Dislike}).lean();
        return {
            likesCount,
            dislikesCount
        }
    }

    async setStatus(parentId: string, authId: string, status: LikeStatusEnum) {
        const existingLike = await likeModel.findOne({parentId: parentId, authId: authId});
        if (existingLike) {
            if (existingLike.status === status) {
                return existingLike
            }

            existingLike.status = status;
            return await existingLike.save();

        }

        return await likeModel.createLike({parentId: parentId, status: status, authorId: authId});
    }
}