import {CommentsRepository} from "../../dal/CommentsRepository";
import {CommentViewModelType} from "../type/input-outup-commets";
import {ServiceResponseType} from "../../../../types/service-response-type";
import {StatusCode} from "../../../../types/status-code-types";
import {PostRepository} from "../../../post/dal/postRepository";
import {UserRepository} from "../../../user/dal/UserRepository";
import {inject, injectable} from "inversify";
import {CommentsRepositoryMongo} from "../../dal/CommentsRepositoryMongo";
import {ErrorItemType} from "../../../../types/output-error-types";
import {BaseModel} from "../../../../shared/model/BaseModel";

type CreatedResponse = string | null;

@injectable()
export class CommentsService {
    constructor(readonly postRepository: PostRepository, protected userRepository: UserRepository,
                @inject(CommentsRepositoryMongo) protected commentsRepository: CommentsRepository) {
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

            const exceptions: ErrorItemType[] = BaseModel.formatValidationError(err);
            const status = BaseModel.formatValidationError(err) ? StatusCode.BAD_REQUEST_400 : StatusCode.SERVER_ERROR;
            return {
                status: status,
                data: null,
                extensions: exceptions
            }
        }
    }

    async updateComment(commentId: string, commentBody: string, userId: string): Promise<ServiceResponseType> {
        let findComment = await this.commentsRepository.getComment(commentId);
        if (!findComment) {
            return {
                status: StatusCode.NOT_FOUND__404,
                extensions: [], data: null
            }
        }
        if (findComment.commentatorInfo.userId !== userId) {
            return {
                status: StatusCode.FORBIDDEN_403,
                extensions: [], data: null
            }
        }
        await this.commentsRepository.updateComment(commentId, commentBody);
        return {
            status: StatusCode.NO_CONTENT_204,
            extensions: [], data: null
        }

    }

    async deleteComment(commentId: string, userId: string): Promise<ServiceResponseType> {
        let comment = await this.commentsRepository.getComment(commentId);
        if (!comment) {
            return {
                status: StatusCode.NOT_FOUND__404, extensions: [], data: null

            }
        }
        if (comment.commentatorInfo.userId !== userId) {
            return {
                status: StatusCode.FORBIDDEN_403,
                extensions: [], data: null
            }
        }

        await this.commentsRepository.deleteComment(commentId);
        return {
            status: StatusCode.NO_CONTENT_204,
            extensions: [], data: null
        }
    }

    async getComment(commentId: string): Promise<CommentViewModelType | null> {
        let comment = await this.commentsRepository.getComment(commentId);
        return comment;
    }

}

