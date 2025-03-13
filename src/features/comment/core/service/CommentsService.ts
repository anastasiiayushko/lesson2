import {CommentsRepository} from "../../dal/CommentsRepository";
import {ServiceResponseType} from "../../../../types/service-response-type";
import {StatusCode} from "../../../../types/status-code-types";
import {PostRepository} from "../../../post/dal/postRepository";
import {UserRepository} from "../../../user/dal/UserRepository";
import {inject, injectable} from "inversify";
import {CommentsRepositoryMongo} from "../../dal/CommentsRepositoryMongo";
import {BaseModel} from "../../../../shared/model/BaseModel";
import {commentModel} from "../../domain/comment-entity";
import {LikeService} from "../../../like/application/like.service";
import {LikeStatusEnum} from "../../../like/domain/like.entity";

type CreatedResponse = string | null;

@injectable()
export class CommentsService {
    constructor(readonly postRepository: PostRepository, protected userRepository: UserRepository,
                @inject(CommentsRepositoryMongo) protected commentsRepository: CommentsRepository,
                protected likeService: LikeService
    ) {
    }

    async createComment(postId: string, commentBody: string, userId: string): Promise<ServiceResponseType<CreatedResponse>> {

        let post = await this.postRepository.getById(postId);
        if (!post) {
            return {
                status: StatusCode.NOT_FOUND__404,
                data: null, extensions: [], errorMessage: "Not found post by id"
            }
        }
        let user = await this.userRepository.getUserById(userId);
        if (!user) {
            return {
                status: StatusCode.SERVER_ERROR,
                data: null, extensions: [], errorMessage: "Not found user by id"
            }
        }
        try {
            let commentId = await this.commentsRepository.createComment({
                postId: postId,
                userId: userId,
                userLogin: user.login,
                content: commentBody
            });
            return {
                status: StatusCode.CREATED_201,
                data: commentId,
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

    async updateComment(commentId: string, commentBody: string, userId: string): Promise<ServiceResponseType> {
        const comment = await commentModel.findById({_id: commentId});
        if (!comment) {
            return {
                status: StatusCode.NOT_FOUND__404,
                extensions: [], data: null
            }
        }
        if (comment.commentatorInfo.userId.toString() !== userId) {
            return {
                status: StatusCode.FORBIDDEN_403,
                extensions: [], data: null
            }
        }
        comment.content = commentBody;
        await this.commentsRepository.save(comment);
        return {
            status: StatusCode.NO_CONTENT_204,
            extensions: [], data: null
        }
    }

    async deleteComment(commentId: string, userId: string): Promise<ServiceResponseType> {
        const comment = await this.commentsRepository.getComment(commentId);
        if (!comment) {
            return {
                status: StatusCode.NOT_FOUND__404, extensions: [], data: null

            }
        }
        if (comment.commentatorInfo.userId.toString() !== userId) {
            return {
                status: StatusCode.FORBIDDEN_403,
                extensions: [], data: null
            }
        }

        await this.commentsRepository.deleteComment(commentId);
        await this.likeService.deleteLikeByParentId(commentId);
        return {
            status: StatusCode.NO_CONTENT_204,
            extensions: [], data: null
        }
    }


    async updateLikeStatusForCommentAndRecalculate(commentId: string, userId:string, likeStatus: LikeStatusEnum): Promise<ServiceResponseType> {
        const comment = await commentModel.findById({_id: commentId});

        if (!comment) {
            return {
                status: StatusCode.NOT_FOUND_404,
                extensions: [], data: null
            };
        }
        const likeResult = await this.likeService.setStatus(commentId, userId, likeStatus);
        console.log('likeResult', likeResult);
        if(likeResult.status === StatusCode.BAD_REQUEST_400 || likeResult.status === StatusCode.SERVER_ERROR || likeResult.extensions.length>0) {
            return {
                status: StatusCode.BAD_REQUEST_400,
                extensions: likeResult.extensions,
                data: null
            }
        }
        const calculateLikes = await this.likeService.calculateLikeStatusByParentId(commentId);
        comment.likesInfo ={
            likesCount: calculateLikes.likesCount,
            dislikesCount: calculateLikes.dislikesCount
        }
        await this.commentsRepository.save(comment)
        return {
            status: StatusCode.NO_CONTENT_204,
            extensions: [], data: null
        }
    }

}

