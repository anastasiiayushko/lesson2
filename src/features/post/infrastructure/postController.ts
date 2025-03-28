import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
import {isStatusNoContent, isStatusNotFound, isStatusOk, StatusCode} from "../../../types/status-code-types";
import {PostQueryInputType} from "../../../db/types/db-post-type";
import {postQueryPagingDef} from "../helpers/postQueryPagingDef";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {injectable} from "inversify";
import {PostQueryRepository} from "./repositories/postQueryRepository";
import CreatePostUseCase from "../application/use-case/СreatePostUseCase";
import UpdatePostUseCase from "../application/use-case/UpdatePostUseCase";
import DeletePostUseCase from "../application/use-case/DeletePostUseCase";
import {LikeStatusEnum} from "../../like/domain/like.entity";
import LikeStatusPostUseCase from "../application/use-case/LikeStatusPostUseCase";

@injectable()
export class PostController {

    constructor(
        protected postQueryRepository: PostQueryRepository,
        protected createPostUseCase: CreatePostUseCase,
        protected updatePostUseCase: UpdatePostUseCase,
        protected deletePostUseCase: DeletePostUseCase,
        protected setLikeStatusPostUseCase: LikeStatusPostUseCase,
    ) {
    }

    async getPostsWithPaging(req: Request<{}, {}, {}, {}>,
                             res: Response<PaginationViewModelType<PostViewModel>>) {
        let query: PostQueryInputType = req.query as PostQueryInputType;
        let queryDef = postQueryPagingDef(query);
        const userId = req.userId
        let postsPaging = await this.postQueryRepository.getPostQuery(queryDef, undefined,  userId);
        res.status(StatusCode.OK_200).json(postsPaging);
    }

    async getPost(req: Request<{ id: string }>, res: Response<PostViewModel>) {
        let id = req.params.id;
        const userId = req?.userId ?? null;
        let post = await this.postQueryRepository.getById(id, userId);
        if (!post) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.status(StatusCode.OK_200).json(post);
    }

    async createPost(req: Request<{}, {}, PostInputModel>, res: Response<PostViewModel>) {
        const result = await this.createPostUseCase.execute(req.body);
        const userId = req?.userId ?? null;
        if (isStatusNotFound(result.status)) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return
        }

        const post = await this.postQueryRepository.getById(result.data!.id, userId);
        res.status(StatusCode.CREATED_201).json(post!);
    }

    async updatePost(req: Request<{ id: string }, {}, PostInputModel>, res: Response) {
        const result = await this.updatePostUseCase.execute(req.params.id, req.body);
        if (isStatusNotFound(result.status)) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.sendStatus(result.status);
    }

    async deletePost(req: Request<{ id: string }>,
                     res: Response) {
        const result = await this.deletePostUseCase.execute(req.params.id);

        if (isStatusNotFound(result.status)) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.sendStatus(StatusCode.NO_CONTENT_204)

    }

    async setLikeStatus(req: Request<{ postId: string }>, res: Response) {
        const userId = req.userId as string;
        const likeStatus = req.body.likeStatus as LikeStatusEnum;
        const result = await this.setLikeStatusPostUseCase.execute(req.params.postId, userId, likeStatus)

        if (isStatusNotFound(result.status)) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return;
        }
        if (isStatusNoContent(result.status)) {
            res.sendStatus(StatusCode.NO_CONTENT_204)
            return;
        }
        res.sendStatus(result.status);

    }
}