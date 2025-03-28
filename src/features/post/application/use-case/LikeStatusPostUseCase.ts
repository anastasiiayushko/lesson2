import {LikeService} from "../../../like/application/like.service";
import {injectable} from "inversify";
import {PostRepository} from "../../infrastructure/repositories/postRepository";
import {LikeStatusEnum} from "../../../like/domain/like.entity";
import {ServiceResponseType} from "../../../../types/service-response-type";
import {isStatusOk, StatusCode} from "../../../../types/status-code-types";
import {LikeQueryRepository} from "../../../like/infra/like.query.repository";
import {LikeInfoDTO} from "../../domain/postSchema";

@injectable()
class LikeStatusPostUseCase {
    constructor(
        private likeService: LikeService,
        private likeQueryRepository: LikeQueryRepository,
        private postRepository: PostRepository) {
    }

    async execute(id: string, userId: string, likeStatus: LikeStatusEnum): Promise<ServiceResponseType> {

        const smartPost = await this.postRepository.findById(id);

        if (!smartPost) {
            return {
                status: StatusCode.NOT_FOUND_404,
                extensions: [],
                data: null
            }
        }

        const setLikeCommand = await this.likeService.setStatus(smartPost._id.toString(), userId, likeStatus);
        if (!isStatusOk(setLikeCommand.status)) {
            return {
                status: setLikeCommand.status,
                extensions: setLikeCommand.extensions,
                data: null
            }
        }

        const calculateLikeStatus = await this.likeService.calculateLikeStatusByParentId(smartPost._id.toString());
        const newestLikes = await this.likeQueryRepository.getNewestLikesByParentId(smartPost._id.toString(), 3)


         smartPost.setLikesInfo(new LikeInfoDTO(calculateLikeStatus.likesCount, calculateLikeStatus.dislikesCount, newestLikes))

        await this.postRepository.save(smartPost);
        return {
            status: StatusCode.NO_CONTENT_204,
            data: null,
            extensions: [],
        }

    }
}

export default LikeStatusPostUseCase;