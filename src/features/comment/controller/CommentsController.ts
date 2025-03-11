import {Request, Response} from "express";
import {CommentsService} from "../core/service/CommentsService";
import {PostQueryRepository} from "../../post/dal/postQueryRepository";
import {StatusCode} from "../../../types/status-code-types";
import {CommentsQueryRepositoryMongo} from "../dal/CommentsQueryRepositoryMongo";
import {CommentQueryInputType, commentQueryPagingDef} from "../helpers/commentQueryPagingDef";
import {inject, injectable} from "inversify";
import {CommentsQueryRepository} from "../dal/CommentsQueryRepository";
import {jwtService} from "../../../app/jwtService";

@injectable()
export class CommentsController {

    constructor(protected commentsService: CommentsService,
               @inject(CommentsQueryRepositoryMongo) protected commentsQueryRepository: CommentsQueryRepository,
                protected postQueryRepository: PostQueryRepository,
    ) {
    }

    createComment = async (req: Request<{ postId: string }>,
                           res: Response) => {
        try {
            let userId = req!.userId as string;
            let postId = req.params.postId;
            let commentBody = req.body.content;
            //
            // if (!userId) {
            //     res.sendStatus(StatusCode.UNAUTHORIZED_401);
            //     return;
            // }

            let result = await this.commentsService.createComment(postId, commentBody, userId);
            if(result.status !== StatusCode.CREATED_201){
                if(Array.isArray(result.extensions) && result.extensions.length > 0){
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
        const authorization = req.headers['authorization'] || '';
        let token = authorization.split(' ')?.[1];
        if (!token) {
            throw new Error(`${StatusCode.UNAUTHORIZED_401}`)
        }
        const decode = await jwtService.verifyAccessToken(token);
        const userId = decode?.userId ?? null;
        let comment = await this.commentsQueryRepository.getCommentById(req.params.id, userId);
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