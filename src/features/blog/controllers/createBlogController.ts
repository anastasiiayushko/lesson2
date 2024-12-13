import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../types/input-output-types/blog-types";
import {BlogRepository} from "../blogRepository";
import {StatusCode} from "../../../types/status-code-types";


const blogRepository = new BlogRepository();

export const createBlogController = (req: Request<{}, {}, BlogInputModel>,
                                     res: Response<BlogViewModel>) => {


    let body = req.body;
    let blogData = {
        name: body.name,
        description: body.description,
        websiteUrl: body.websiteUrl
    }
    let createBlog = blogRepository.createBlog(blogData);
    res.status(StatusCode.CREATED_201).json(createBlog)

}