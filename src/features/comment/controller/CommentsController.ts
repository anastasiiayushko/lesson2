import {Request, Response} from "express";
import {CommentsService} from "../core/service/CommentsService";
import {PostQueryRepository} from "../../post/dal/postQueryRepository";
import {StatusCode} from "../../../types/status-code-types";
import {CommentsQueryRepositoryMongo} from "../dal/CommentsQueryRepositoryMongo";
import {CommentQueryInputType, commentQueryPagingDef} from "../helpers/commentQueryPagingDef";
import {injectable} from "inversify";

@injectable()
export class CommentsController {

    constructor(protected commentsService: CommentsService,
                protected commentsQueryRepository: CommentsQueryRepositoryMongo,
                protected postQueryRepository: PostQueryRepository,
    ) {
    }

    createComment = async (req: Request<{ postId: string }>,
                           res: Response) => {
        try {
            let userId = req!.userId;
            let postId = req.params.postId;
            let commentBody = req.body.content;

            if (!userId) {
                res.sendStatus(StatusCode.UNAUTHORIZED_401);
                return;
            }

            let result = await this.commentsService.createComment(postId, commentBody, userId);
            if (!result.data) {
                res.sendStatus(result.status);
                return;
            }

            let comment = await this.commentsQueryRepository.getCommentById(result.data);
            res.status(StatusCode.CREATED_201).send(comment);
        } catch (error) {
            //@ts-ignore
            res.send({error: error.message});
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
        let comment = await this.commentsQueryRepository.getCommentById(req.params.id);
        if (!comment) {
            res.sendStatus(StatusCode.NOT_FOUND__404);
            return
        }
        res.status(StatusCode.OK_200).json(comment);
    }
    getCommentsByPostIdWithPaging = async (req: Request<{ postId: string }, {}, {}, {}>, res: Response) => {
        let postId = req.params.postId;
        let post = await this.postQueryRepository.getById(postId);
        if (!post) {
            res.sendStatus(StatusCode.NOT_FOUND__404);
            return;
        }
        let query: CommentQueryInputType = req.query as CommentQueryInputType;
        let queryDef = commentQueryPagingDef(query);
        let postsWithPaging = await this.commentsQueryRepository.getCommentsByPostWithPaging(post.id, queryDef);
        res.status(StatusCode.OK_200).json(postsWithPaging);

    }

}