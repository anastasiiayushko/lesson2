import {Request, Response} from "express";
import {BlogInputModelType, BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {isStatusNotFound, StatusCode} from "../../../types/status-code-types";
import {BlogService} from "../blogService";
import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
import {BlogQueryInputType} from "../../../db/types/db-blog-type";
import {blogQueryPagingDef} from "../helpers/blogQueryPagingDef";
import {PostQueryInputType} from "../../../db/types/db-post-type";
import {postQueryPagingDef} from "../../post/helpers/postQueryPagingDef";
import {PaginationViewModelType} from "../../../types/input-output-types/pagination-output-types";
import {BlogQueryRepository} from "../dal/blogQueryRepository";
import {injectable} from "inversify";
import {PostQueryRepository} from "../../post/infrastructure/repositories/postQueryRepository";
import CreatePostUseCase from "../../post/application/use-case/СreatePostUseCase";


@injectable()
export class BlogController {


    constructor(
        protected createPostUseCase: CreatePostUseCase,
        protected blogService: BlogService,
        protected postQueryRepository: PostQueryRepository,
        protected blogQueryRepository: BlogQueryRepository) {
    }

    async getBlogsWithPaging(req: Request<{}, {}, {}, {}>,
                             res: Response<PaginationViewModelType<BlogViewModelType>>) {
        const query: BlogQueryInputType = req.query as BlogQueryInputType;
        const queryDef = blogQueryPagingDef(query);
        const blogs = await this.blogQueryRepository.getBlogsQuery(queryDef);
        res.status(StatusCode.OK_200).json(blogs)
    }

    async getPostsByBlogIdWithPaging(req: Request<{ blogId: string }, {}, {}, {}>,
                                     res: Response<PaginationViewModelType<PostViewModel>>) {
        const blogId = req.params.blogId as string;
        const blog = await this.blogService.getById(blogId);
        if (!blog) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        const query: PostQueryInputType = req.query as PostQueryInputType;
        const queryDef = postQueryPagingDef(query);
        const userId = req.userId;
        const posts = await this.postQueryRepository.getPostQuery(queryDef, blogId, userId);
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

        const postResult = await this.createPostUseCase.execute(body);

        if (isStatusNotFound(postResult.status)) {
            res.sendStatus(StatusCode.NOT_FOUND_404)
            return
        }
        const post = await this.postQueryRepository.getById(postResult.data!.id);
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