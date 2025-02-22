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
import {PostQueryRepository} from "../../post/dal/postQueryRepository";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {BlogQueryRepository} from "../dal/blogQueryRepository";
import {injectable} from "inversify";


@injectable()
export class BlogController {


    constructor(protected postService: PostService,
                protected blogService: BlogService,
                protected postQueryRepository: PostQueryRepository,
                protected blogQueryRepository: BlogQueryRepository) {
    }

    async getBlogsWithPaging(req: Request<{}, {}, {}, {}>,
                             res: Response<PaginationViewModelType<BlogViewModelType>>) {
        const query: BlogQueryInputType = req.query as BlogQueryInputType;
        let queryDef = blogQueryPagingDef(query);
        let blogs = await this.blogQueryRepository.getBlogsQuery(queryDef);
        res.status(StatusCode.OK_200).json(blogs)
    }

    async getPostsByBlogIdWithPaging(req: Request<{ blogId: string }, {}, {}, {}>,
                                     res: Response<PaginationViewModelType<PostViewModel>>) {
        let blogId = req.params.blogId as string;
        let blog = await this.blogService.getById(blogId);
        if (!blog) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        let query: PostQueryInputType = req.query as PostQueryInputType;
        let queryDef = postQueryPagingDef(query);
        let posts = await this.postQueryRepository.getPostQuery(queryDef, blogId);
        res.status(StatusCode.OK_200).json(posts)
    }

    async getBlogById(req: Request<{ id: string }>,
                      res: Response<BlogViewModelType>) {
        let id = req.params.id;
        let blog = await this.blogQueryRepository.getById(id);

        if (!blog) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.status(StatusCode.OK_200).json(blog);
    }


    async createPostForSpecificBlog(req: Request<{
        blogId: string
    }, {}, PostInputModel>, res: Response<PostViewModel>) {
        let blogId = req.params.blogId;
        let body = {...req.body, blogId: blogId};
        let postId = await this.postService.createPost(body);
        if (!postId) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return
        }
        let post = await this.postQueryRepository.getById(postId);
        res.status(StatusCode.CREATED_201).json(post!);

    }

    async createBlog(req: Request<{}, {}, BlogInputModelType>,
                     res: Response<BlogViewModelType>) {

        let blogId = await this.blogService.createBlog(req.body);
        if (!blogId) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return
        }
        let blog = await this.blogQueryRepository.getById(blogId);
        if (!blog) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return
        }
        res.status(StatusCode.CREATED_201).json(blog);

    }


    async updateBlogById(req: Request<{ id: string }, {}, BlogInputModelType>,
                         res: Response) {
        let id = req.params.id;
        let isUpdated = await this.blogService.updateById(id, req.body)
        if (isUpdated) {
            res.sendStatus(StatusCode.NO_CONTENT_204);
            return;
        }
        res.sendStatus(StatusCode.NOT_FOUND__404);
    }

    async deleteBlogById(req: Request<{ id: string }>,
                         res: Response) {
        let id = req.params.id;
        let isRemovedBlog = await this.blogService.deleteDyId(id);

        if (isRemovedBlog) {
            res.sendStatus(StatusCode.NO_CONTENT_204);
            return
        }
        res.sendStatus(StatusCode.NOT_FOUND__404);

    }


}