import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
import {StatusCode} from "../../../types/status-code-types";
import {PostService} from "../postService";

export class PostController {
    private _postService = new PostService();

    _mapperBodyPost = (body: PostInputModel): PostInputModel => {
        return {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
        }
    }

    getPosts = async (req: Request, res: Response<PostViewModel[]>) => {
        let posts = await this._postService.getAll();
        res.status(StatusCode.OK_200).json(posts);
    }

    getPost = async (req: Request<{id:string}>, res: Response<PostViewModel>) => {
        let id = req.params.id;
        let post = await this._postService.getById(id);
        if (!post) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.status(StatusCode.OK_200).json(post);
    }

    createPost = async (req: Request<{}, {}, PostInputModel>,
                        res: Response<PostViewModel>) => {
        let body = req.body;

        let postData = this._mapperBodyPost(body)
        let createdPost = await this._postService.createPost(postData);

        res.status(StatusCode.CREATED_201).json(createdPost);
    }

    updatePost = async (req: Request<{ id: string }, {}, PostInputModel>,
                        res: Response) => {
        let postId = req.params.id;
        let body = req.body;

        let postData = this._mapperBodyPost(body);

        let isUpdatedPost = await this._postService.updatePostById(postId, postData);

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