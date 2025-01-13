import {Request, Response} from "express";
import {BlogInputModelType, BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {StatusCode} from "../../../types/status-code-types";
import {BlogService} from "../blogService";
import {PostService} from "../../post/service/postService";
import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
import {BlogQueryInputType} from "../../../db/types/db-blog-type";
import {blogQueryPagingDef} from "../helpers/blogQueryPagingDef";
import {PostQueryInputType} from "../../../db/types/db-post-type";
import {postQueryPagingDef} from "../../post/helpers/postQueryPagingDef";
import {BlogQueryRepository} from "../dal/blogQueryRepository";
import {PostQueryRepository} from "../../post/dal/postQueryRepository";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";


export class BlogController {
    private _blogService = new BlogService()
    private _postService = new PostService();
    private _blogQueryRepo = new BlogQueryRepository();
    private _postQueryRepo = new PostQueryRepository();


    getBlogsWithPaging =
        async (req: Request<{}, {}, {}, {}>,
               res: Response<PaginationViewModelType<BlogViewModelType>>
        ) => {
            const query: BlogQueryInputType = req.query as BlogQueryInputType;
            let queryDef = blogQueryPagingDef(query);
            let blogs = await this._blogQueryRepo.getBlogsQuery(queryDef);
            res.status(StatusCode.OK_200).json(blogs)
        }

    getPostsByBlogIdWithPaging = async (req: Request<{ blogId: string }, {}, {}, {}>,
                                        res: Response<PaginationViewModelType<PostViewModel>>) => {
        let blogId = req.params.blogId as string;
        let blog = await this._blogService.getById(blogId);
        if (!blog) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        let query: PostQueryInputType = req.query as PostQueryInputType;
        let queryDef = postQueryPagingDef(query);
        let posts = await this._postQueryRepo.getPostQuery(queryDef, blogId);
        res.status(StatusCode.OK_200).json(posts)
    }

    getBlogById = async (req: Request<{ id: string }>,
                         res: Response<BlogViewModelType>) => {
        let id = req.params.id;
        let blog = await this._blogQueryRepo.getById(id);

        if (!blog) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.status(StatusCode.OK_200).json(blog);
    }


    createPostForSpecificBlog = async (req: Request<{
        blogId: string
    }, {}, PostInputModel>, res: Response<PostViewModel>) => {
        let blogId = req.params.blogId;
        let body = {...req.body, blogId: blogId};
        let postId = await this._postService.createPost(body);
        if (!postId) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return
        }
        let post = await this._postQueryRepo.getById(postId);
        res.status(StatusCode.CREATED_201).json(post!);

    }

    createBlog =
        async (req: Request<{}, {}, BlogInputModelType>,
               res: Response<BlogViewModelType>) => {

            let blogId = await this._blogService.createBlog(req.body);
            if (!blogId) {
                res.sendStatus(StatusCode.NOT_FOUND_404)
                return
            }
            let blog = await this._blogQueryRepo.getById(blogId);
            if (!blog) {
                res.sendStatus(StatusCode.NOT_FOUND_404)
                return
            }
            res.status(StatusCode.CREATED_201).json(blog);

        }


    updateBlogById =
        async (req: Request<{ id: string }, {}, BlogInputModelType>,
               res: Response) => {
            let id = req.params.id;
            let isUpdated = await this._blogService.updateById(id, req.body)
            if (isUpdated) {
                res.sendStatus(StatusCode.NO_CONTENT_204);
                return;
            }
            res.sendStatus(StatusCode.NOT_FOUND__404);
        }

    deleteBlogById = async (req: Request<{ id: string }>,
                            res: Response) => {
        let id = req.params.id;
        let isRemovedBlog = await this._blogService.deleteDyId(id);

        if (isRemovedBlog) {
            res.sendStatus(StatusCode.NO_CONTENT_204);
            return
        }
        res.sendStatus(StatusCode.NOT_FOUND__404);

    }


}