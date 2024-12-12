import {Request, Response} from "express";
import {BlogRepository} from "../blogRepository";
import {StatusCode} from "../../../types/status-code-types";
import {BlogViewModel} from "../../../types/input-output-types/blog-types";

const blogRepository = new BlogRepository();
export const getBlogsController = async (req: Request,
                                         res: Response<BlogViewModel[]>) => {

    let blogs = blogRepository.getAll();
    res.status(StatusCode.OK_200).json(blogs)

}