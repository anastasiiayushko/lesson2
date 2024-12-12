import {Response, Request} from "express";
import {BlogRepository} from "../blogRepository";
import {StatusCode} from "../../../types/status-code-types";

const blogRepository = new BlogRepository()

export const delBlogByIdController = (req: Request<{ id: string }>,
                                      res: Response) => {
    let id = req.params.id;
    let findBlogBydId = blogRepository.getById(id);
    if (!findBlogBydId) {
        res.sendStatus(StatusCode.NOT_FOUND__404);
        return
    }
    blogRepository.deleteDyId(id);
    res.sendStatus(StatusCode.NO_CONTENT_204);

}