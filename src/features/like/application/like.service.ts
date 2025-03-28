import {injectable} from "inversify";
import {LikeModel, LikeStatusEnum} from "../domain/like.entity";
import {BaseModel} from "../../../shared/model/BaseModel";
import {StatusCode} from "../../../types/status-code-types";
import {ServiceResponseType} from "../../../types/service-response-type";
import {UserRepository} from "../../user/dal/UserRepository";
import {LikeRepository} from "../infra/like.repository";


@injectable()
export class LikeService {
    constructor(protected userRepository: UserRepository,
                protected likeRepository: LikeRepository,

    ) {
    }

    async calculateLikeStatusByParentId(parentId: string): Promise<{ likesCount: number, dislikesCount: number }> {
        const likesCount = await LikeModel.countDocuments({parentId: parentId, status: LikeStatusEnum.Like});
        const dislikesCount = await LikeModel.countDocuments({parentId: parentId, status: LikeStatusEnum.Dislike});
        return {
            likesCount: likesCount,
            dislikesCount: dislikesCount
        }
    }

    async deleteLikeByParentId(parentId: string): Promise<boolean> {
        const deleted = await LikeModel.deleteMany({parentId: parentId})
        return !!deleted.deletedCount;
    }


    /**  */
    async setStatus(parentId: string, authId: string, status: LikeStatusEnum): Promise<ServiceResponseType<{
        id: string
    } | null>> {
        try {

            const user = await this.userRepository.getUserById(authId);
            if (!user) {
                return {
                    status: StatusCode.UNAUTHORIZED_401,
                    data: null,
                    extensions: []
                }
            }

            const existingLike = await LikeModel.findOne({parentId: parentId, authorId: authId});

            if (existingLike) {
                if (existingLike.status === status) {
                    return {
                        status: StatusCode.OK_200,
                        data: {id: existingLike._id.toString()},
                        extensions: []
                    }
                }

                existingLike.status = status;
                await existingLike.validate();
                await existingLike.save();
                return {
                    status: StatusCode.OK_200,
                    data: {id: existingLike._id.toString()},
                    extensions: []
                }
            }

            const like = await LikeModel.createLike({
                parentId: parentId,
                status: status,
                authorId: authId,
                authorName: user!.login
            });
            await this.likeRepository.save(like);
            return {
                status: StatusCode.OK_200,
                data: {id: like._id.toString()},
                extensions: []
            }


        } catch (err: unknown) {

            const exceptions = BaseModel.formatValidationError(err);
            const status = BaseModel.formatValidationError(err) ? StatusCode.BAD_REQUEST_400 : StatusCode.SERVER_ERROR;

            return {
                status: status,
                data: null,
                extensions: exceptions
            }
        }
    }
}