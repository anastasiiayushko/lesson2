import {Response, Request} from "express";
import {BlogViewModel} from "../../../types/input-output-types/blog-types";
import {BlogRepository} from "../blogRepository";
import {StatusCode} from "../../../types/status-code-types";

const blogRepository = new BlogRepository()
export const getBlogByIdController = (req: Request<{ id: string }>,
                                      res: Response<BlogViewModel>) => {
    let id = req.params.id;
    let blog = blogRepository.getById(id);
    if (!blog) {
        res.sendStatus(StatusCode.NOT_FOUND_404);
        return;
    }
    res.status(StatusCode.OK_200).json(blog);
}