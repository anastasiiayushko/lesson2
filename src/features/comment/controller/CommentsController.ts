import {Request, Response} from "express";
import {CommentsService} from "../core/service/CommentsService";
import {StatusCode} from "../../../types/status-code-types";
import {CommentsQueryRepositoryMongo} from "../dal/CommentsQueryRepositoryMongo";
import {CommentQueryInputType, commentQueryPagingDef} from "../helpers/commentQueryPagingDef";
import {inject, injectable} from "inversify";
import {CommentsQueryRepository} from "../dal/CommentsQueryRepository";
import { PostQueryRepository } from "../../post/infrastructure/repositories/postQueryRepository";

@injectable()
export class CommentsController {

    constructor(protected commentsService: CommentsService,
                @inject(CommentsQueryRepositoryMongo) protected commentsQueryRepository: CommentsQueryRepository,
                protected postQueryRepository: PostQueryRepository,
    ) {
    }

    async setLikeComment(req: Request, res: Response) {
        try {
            console.log('setLikeComment');
            const commentId = req.params.commentId;
            const userId = req!.userId as string;
            const likeStatus = req.body.likeStatus;

            const reslut = await this.commentsService.updateLikeStatusForCommentAndRecalculate(commentId, userId, likeStatus)
            console.log('result')
            if (reslut.extensions.length > 0) {
                console.log('error')
                res.status(reslut.status).json({
                    errorsMessages: reslut.errorMessage
                })
                return;
            }
            res.sendStatus(reslut.status);

        } catch (e: unknown) {
            //@ts-ignore
            res.send({error: error});
        }
    }

    createComment = async (req: Request<{ postId: string }>,
                           res: Response) => {
        try {
            let userId = req!.userId as string;
            let postId = req.params.postId;
            let commentBody = req.body.content;

            let result = await this.commentsService.createComment(postId, commentBody, userId);
            if (result.status !== StatusCode.CREATED_201) {
                if (Array.isArray(result.extensions) && result.extensions.length > 0) {
                    res.status(result.status).send({errorsMessages: result.extensions});
                }
                res.sendStatus(result.status);
                return;
            }

            let comment = await this.commentsQueryRepository.getCommentById(result!.data as string, userId);
            res.status(StatusCode.CREATED_201).send(comment);
        } catch (error) {
            //@ts-ignore
            console.error('error', error);
            res.send({error: error});
        }


    }
    updateCommentsById = async (req: Request<{ commentId: string }>, res: Response) => {
        let userId = req!.userId || '';
        let responseService = await this.commentsService.updateComment(req.params.commentId, req.body.content, userId);
        res.sendStatus(responseService.status);

    }
    deleteCommentById = async (req: Request<{ commentId: string }>, res: Response) => {
        let userId = req!.userId || '';
        let result = await this.commentsService.deleteComment(req.params.commentId, userId);

        res.sendStatus(result.status);
    }
    getCommentById = async (req: Request<{ id: string }>, res: Response) => {
        const userId = req?.userId ?? null;
        console.log('userId ', userId);
        let comment = await this.commentsQueryRepository.getCommentById(req.params.id, userId);
        if (!comment) {
            res.sendStatus(StatusCode.NOT_FOUND__404);
            return
        }
        res.status(StatusCode.OK_200).json(comment);
    }
    getCommentsByPostIdWithPaging = async (req: Request<{ postId: string }, {}, {}, {}>, res: Response) => {
        const postId = req.params.postId;
        const userId = req?.userId ?? null;
        const post = await this.postQueryRepository.getById(postId);
        if (!post) {
            res.sendStatus(StatusCode.NOT_FOUND__404);
            return;
        }
        const query: CommentQueryInputType = req.query as CommentQueryInputType;
        const queryDef = commentQueryPagingDef(query);
        const postsWithPaging = await this.commentsQueryRepository.getCommentsByPostWithPaging(post.id, queryDef, userId);
        res.status(StatusCode.OK_200).json(postsWithPaging);

    }

}