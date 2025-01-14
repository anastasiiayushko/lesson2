import {CommentsRepository} from "../../dal/CommentsRepository";
import {CommentViewModelType} from "../type/input-outup-commets";
import {ServiceResponseType} from "../../../../types/service-response-type";
import {StatusCode} from "../../../../types/status-code-types";
import {PostRepository} from "../../../post/dal/postRepository";
import {UserRepository} from "../../../user/dal/UserRepository";
import createCommentDto from "../dtos/createComment";

type CreatedResponse = string | null;


export class CommentsService {
    private readonly postRepository: PostRepository;
    private readonly userRepository: UserRepository;

    constructor(readonly commentsRepository: CommentsRepository) {
        this.postRepository = new PostRepository();
        this.userRepository = new UserRepository();
    }

    createComment = async (postId: string, commentBody: string, userId: string): Promise<ServiceResponseType<CreatedResponse>> => {

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
        let dto = createCommentDto(postId, user.id, user.login, commentBody);
        let commentId = await this.commentsRepository.createComment(dto);
        return {
            status: StatusCode.CREATED_201,
            data: commentId,
            extensions: []
        }


    }
    updateComment = async (commentId: string, commentBody: string, userId: string): Promise<ServiceResponseType> => {
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
    deleteComment = async (commentId: string, userId: string): Promise<ServiceResponseType> => {
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
    getComment = async (commentId: string): Promise<CommentViewModelType | null> => {
        let comment = await this.commentsRepository.getComment(commentId);
        return comment;
    }

}

