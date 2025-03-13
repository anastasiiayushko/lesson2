import {injectable} from "inversify";
import {ILike, likeModel, LikeStatusEnum} from "../domain/like.entity";
import {BaseModel} from "../../../shared/model/BaseModel";
import {StatusCode} from "../../../types/status-code-types";
import {ServiceResponseType} from "../../../types/service-response-type";
import {IComment} from "../../comment/domain/comment-entity";
import {ObjectId} from "mongodb";


@injectable()
export class LikeService {
    constructor() {
    }

    async findAuthLikeStatusByParent(authorId: string, parentId: string): Promise<LikeStatusEnum> {
        const like = await likeModel.findOne({authorId: authorId, parentId: parentId}).lean();

        return like?.status ?? LikeStatusEnum.None
    }

    async calculateLikeStatusByParentId(parentId: string): Promise<{ likesCount: number, dislikesCount: number }> {
        const likesCount = await likeModel.countDocuments({parentId: parentId, status: LikeStatusEnum.Like});
        const dislikesCount = await likeModel.countDocuments({parentId: parentId, status: LikeStatusEnum.Dislike});
        return {
            likesCount: likesCount,
            dislikesCount: dislikesCount
        }
    }

    async deleteLikeByParentId(parentId: string): Promise<boolean> {
        const deleted = await likeModel.deleteMany({parentId: parentId})
        return !!deleted.deletedCount;
    }

    /**  */
    async setStatus(parentId: string, authId: string, status: LikeStatusEnum): Promise<ServiceResponseType<{
        id: string
    } | null>> {
        try {
            const existingLike = await likeModel.findOne({parentId: parentId, authorId: authId});

            if (existingLike) {
                if (existingLike.status === status) {
                    return {
                        status: StatusCode.OK_200,
                        data: {id: existingLike._id.toString()},
                        extensions: []
                        // extensions: [{field: "status", message: "not update"}]
                    }
                }

                existingLike.status = status;
                await existingLike.validate();
                await existingLike.save();
                return {
                    status: StatusCode.OK_200,
                    data: {id: existingLike._id.toString()},
                    extensions: []
                    // extensions: [{field: "status", message: " update status" + status}]

                }

            }
            const like = await likeModel.createLike({parentId: parentId, status: status, authorId: authId});
            return {
                status: StatusCode.OK_200,
                data: {id: like._id.toString()},
                extensions: []
                // extensions: [{field: "like", message: JSON.stringify(like)}]
            }


        } catch (err: unknown) {
            console.error(err)
            console.error(err)
            const exceptions = BaseModel.formatValidationError(err);
            const status = BaseModel.formatValidationError(err) ? StatusCode.BAD_REQUEST_400 : StatusCode.SERVER_ERROR;
           console.log(exceptions, status)
            return {
                status: status,
                data: null,
                extensions: exceptions
            }
        }
    }
}