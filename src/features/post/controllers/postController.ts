import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
import {StatusCode} from "../../../types/status-code-types";
import {PostService} from "../service/postService";
import {PostQueryInputType} from "../../../db/types/db-post-type";
import {postQueryPagingDef} from "../helpers/postQueryPagingDef";
import {PostQueryRepository} from "../dal/postQueryRepository";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {injectable} from "inversify";

@injectable()
export class PostController {

    constructor(protected postService: PostService, protected postQueryRepository: PostQueryRepository) {
    }

    async getPostsWithPaging(req: Request<{}, {}, {}, {}>,
                             res: Response<PaginationViewModelType<PostViewModel>>) {
        let query: PostQueryInputType = req.query as PostQueryInputType;
        let queryDef = postQueryPagingDef(query);
        let postsPaging = await this.postQueryRepository.getPostQuery(queryDef);
        res.status(StatusCode.OK_200).json(postsPaging);
    }

    async getPost(req: Request<{ id: string }>, res: Response<PostViewModel>) {
        let id = req.params.id;
        let post = await this.postQueryRepository.getById(id);
        if (!post) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.status(StatusCode.OK_200).json(post);
    }

    async createPost(req: Request<{}, {}, PostInputModel>,
                     res: Response<PostViewModel>) {

        let postId = await this.postService.createPost(req.body);
        if (!postId) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return
        }
        let post = await this.postQueryRepository.getById(postId);
        res.status(StatusCode.CREATED_201).json(post!);
    }

    async updatePost(req: Request<{ id: string }, {}, PostInputModel>,
                     res: Response) {
        let postId = req.params.id;
        let isUpdatedPost = await this.postService.updatePostById(postId, req.body);
        if (!isUpdatedPost) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.sendStatus(StatusCode.NO_CONTENT_204);
    }

    async deletePost(req: Request<{ id: string }>,
                     res: Response) {
        let id = req.params.id;
        let isDeletedPost = await this.postService.delPostById(id)
        if (!isDeletedPost) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.sendStatus(StatusCode.NO_CONTENT_204);
    }
}