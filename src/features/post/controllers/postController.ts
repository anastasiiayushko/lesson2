import {PostRepository} from "../postRepository";
import {Request, Response} from "express";
import {PostViewModel} from "../../../types/input-output-types/post-types";
import {StatusCode} from "../../../types/status-code-types";
import {BlogRepository} from "../../blog/blogRepository";
import {BlogViewModelType} from "../../../types/input-output-types/blog-types";

export class PostController {
    private _postRepo = new PostRepository();
    private _blogRepo = new BlogRepository();

    getPosts = async (req: Request, res: Response<PostViewModel[]>) => {
        let posts = await this._postRepo.getAll();
        res.status(StatusCode.OK_200).json(posts);
    }

    getPost = async (req: Request, res: Response<PostViewModel>) => {
        let id = req.params.id;
        let post = await this._postRepo.getById(id);
        if (!post) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.status(StatusCode.OK_200).json(post);
    }

    createPost = async (req: Request, res: Response<PostViewModel>) => {
        let body = req.body;
        let blog = await this._blogRepo.getById(body.blogId) as BlogViewModelType;

        let postData = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blog.id,
            blogName: blog.name
        }
        let createdPost = await this._postRepo.createPost(postData);

        res.status(StatusCode.CREATED_201).json(createdPost);
    }

    updatePost = async (req: Request<{ id: string }>, res: Response) => {
        let postId = req.params.id;
        let body = req.body;
        let blog = await this._blogRepo.getById(body.blogId) as BlogViewModelType;

        let postData = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blog.id,
            blogName: blog.name
        }
        let isUpdatedPost = await this._postRepo.updatePostById(postId, postData);

        if (!isUpdatedPost) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.sendStatus(StatusCode.NO_CONTENT_204);
    }

    deletePost = async (req: Request<{ id: string }>,
                        res: Response) => {
        let id = req.params.id;
        let isDeletedPost = await this._postRepo.delPostById(id)
        if (!isDeletedPost) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.sendStatus(StatusCode.NO_CONTENT_204);
    }
}