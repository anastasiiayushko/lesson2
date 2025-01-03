import {Request, Response} from "express";
import {BlogInputModelType, BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {StatusCode} from "../../../types/status-code-types";
import {BlogService} from "../blogService";
import {PostService} from "../../post/postService";
import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
import {BlogQueryInputType} from "../../../db/db-blog-type";
import {PaginationViewModelType} from "../../../db/db-types";
import {blogQueryPagingDef} from "../helpers/blogQueryPagingDef";
import {PostQueryInputType} from "../../../db/db-post-type";
import {postQueryPagingDef} from "../../post/helpers/postQueryPagingDef";


export class BlogController {
    private _blogService = new BlogService()
    private _postService = new PostService()

    getBlogsWithPaging =
        async (req: Request<{}, {}, {}, {}>,
               res: Response<PaginationViewModelType<BlogViewModelType>>
        ) => {
            const query: BlogQueryInputType = req.query as BlogQueryInputType;
            let queryDef = blogQueryPagingDef(query);
            let blogs = await this._blogService.getBlogsQuery(queryDef);
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
        let posts = await this._postService.getPostsWithPaging(queryDef, {blogId: blogId});
        res.status(StatusCode.OK_200).json(posts)
    }

    getBlogById = async (req: Request<{ id: string }>,
                         res: Response<BlogViewModelType>) => {
        let id = req.params.id;
        let blog = await this._blogService.getById(id);
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
        let createdPost = await this._postService.createPost(body);
        if (!createdPost) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return
        }
        res.status(StatusCode.CREATED_201).json(createdPost);

    }

    createBlog =
        async (req: Request<{}, {}, BlogInputModelType>,
               res: Response<BlogViewModelType>) => {

            let createBlog = await this._blogService.createBlog(req.body);
            res.status(StatusCode.CREATED_201).json(createBlog);

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
        console.log(isRemovedBlog);
        if (isRemovedBlog) {
            res.sendStatus(StatusCode.NO_CONTENT_204);
            return
        }
        res.sendStatus(StatusCode.NOT_FOUND__404);

    }


}