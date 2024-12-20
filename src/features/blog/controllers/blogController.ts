import {BlogRepository} from "../blogRepository";
import {Request, Response} from "express";
import {BlogInputModelType, BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {StatusCode} from "../../../types/status-code-types";


export class BlogController {
    private _blogRepo = new BlogRepository()

    constructor() {
    }

    getBlogs = async (req: Request,
                      res: Response<BlogViewModelType[]>) => {

        let blogs = await this._blogRepo.getAll();
        res.status(StatusCode.OK_200).json(blogs)

    }
    getBlogById = async (req: Request<{ id: string }>,
                         res: Response<BlogViewModelType>) => {
        let id = req.params.id;
        let blog = await this._blogRepo.getById(id);
        if (!blog) {
            res.sendStatus(StatusCode.NOT_FOUND_404);
            return;
        }
        res.status(StatusCode.OK_200).json(blog);
    }

    createBlog =
        async (req: Request<{}, {}, BlogInputModelType>,
               res: Response<BlogViewModelType>) => {

            let body = req.body;
            let blogData = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
            }
            let createBlog = await this._blogRepo.createBlog(blogData);
            res.status(StatusCode.CREATED_201).json(createBlog);

        }

    updateBlogById =
        async (req: Request<{ id: string }, {}, BlogInputModelType>,
               res: Response) => {
            let id = req.params.id;
            const body = req.body;
            let blogUpdate = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
            let isUpdated = await this._blogRepo.updateById(id, blogUpdate)

            if (isUpdated) {

                res.sendStatus(StatusCode.NO_CONTENT_204);
                return;
            }
            res.sendStatus(StatusCode.NOT_FOUND__404);
        }

    deleteBlogById = async (req: Request<{ id: string }>,
                            res: Response) => {
        let id = req.params.id;
        let isRemovedBlog = await this._blogRepo.deleteDyId(id);
        console.log(isRemovedBlog);
        if (isRemovedBlog) {
            res.sendStatus(StatusCode.NO_CONTENT_204);
            return
        }
        res.sendStatus(StatusCode.NOT_FOUND__404);

    }


}