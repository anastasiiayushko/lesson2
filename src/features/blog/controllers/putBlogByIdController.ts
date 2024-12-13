import {Response, Request} from "express";
import {StatusCode} from "../../../types/status-code-types";
import {BlogRepository} from "../blogRepository";
import {BlogInputModel} from "../../../types/input-output-types/blog-types";

const blogRepository = new BlogRepository()
export const putBlogByIdController = (req: Request<{ id: string }, {}, BlogInputModel>,
                                      res: Response) => {
    let id = req.params.id;
    let findBlogBydId = blogRepository.getById(id);
    if (!findBlogBydId) {
        res.sendStatus(StatusCode.NOT_FOUND__404);
        return
    }
    const body = req.body;
    let blogUpdate = {
        name: body.name,
        description: body.description,
        websiteUrl: body.websiteUrl
    }

    blogRepository.updateById(id, blogUpdate);
    res.sendStatus(StatusCode.NO_CONTENT_204);
}
