import {injectable} from "inversify";
import {LikeModel, LikeStatusEnum} from "../domain/like.entity";
import {IPostNewestLikes} from "../../post/domain/post-types";


@injectable()
export class LikeQueryRepository {

    async getNewestLikesByParentId(parentId: string, limit: number): Promise<IPostNewestLikes[]> {
        const likes = await LikeModel.find({parentId: parentId, status: LikeStatusEnum.Like})
            .sort({createdAt: -1})
            .limit(limit ?? 3)
            .lean()


        //@ts-expect-error
        return likes.map((like) => {
            return {
                addedAt: like.createdAt.toISOString(),
                login: like.authorName,
                userId: like.authorId,

            }
        })

    }

}