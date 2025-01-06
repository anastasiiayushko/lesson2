import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
import {StatusCode} from "../../../types/status-code-types";
import {PostService} from "../service/postService";
import {PostQueryInputType} from "../../../db/types/db-post-type";
import {postQueryPagingDef} from "../helpers/postQueryPagingDef";
import {PostQueryRepository} from "../dal/postQueryRepository";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";

export class PostController {
    private _postService = new PostService();
    private _postQueryRepo = new PostQueryRepository();


    getPostsWithPaging = async (req: Request<{}, {}, {}, {}>,
                                res: Response<PaginationViewModelType<PostViewModel>>) => {
        let query: PostQueryInputType = req.query as PostQueryInputType;
        let queryDef = postQueryPagingDef(query);
        let postsPaging = await this._postQueryRepo.getPostQuery(queryDef);
        res.status(StatusCode.OK_200).json(postsPaging);
    }

    getPost = async (req: Request<{ id: string }>, res: Response<PostViewModel>) => {
        let id = req.params.id;
        let post = await this._postQueryRepo.getById(id);
        if (!post) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.status(StatusCode.OK_200).json(post);
    }

    createPost = async (req: Request<{}, {}, PostInputModel>,
                        res: Response<PostViewModel>) => {

        let postId = await this._postService.createPost(req.body);
        if (!postId) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return
        }
        let post = await this._postQueryRepo.getById(postId);
        res.status(StatusCode.CREATED_201).json(post!);
    }

    updatePost = async (req: Request<{ id: string }, {}, PostInputModel>,
                        res: Response) => {
        let postId = req.params.id;
        let isUpdatedPost = await this._postService.updatePostById(postId, req.body);
        if (!isUpdatedPost) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.sendStatus(StatusCode.NO_CONTENT_204);
    }

    deletePost = async (req: Request<{ id: string }>,
                        res: Response) => {
        let id = req.params.id;
        let isDeletedPost = await this._postService.delPostById(id)
        if (!isDeletedPost) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.sendStatus(StatusCode.NO_CONTENT_204);
    }
}