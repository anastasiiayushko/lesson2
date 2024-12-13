import {Response, Request} from "express";
import {PostRepository} from "../postRepository";
import {StatusCode} from "../../../types/status-code-types";

const postRepository = new PostRepository();
export const delPostByIdController = (req: Request<{ id: string }>,
                                      res: Response) => {
    let id = req.params.id;
    let post = postRepository.getById(id);
    if (!post) {
        res.sendStatus(StatusCode.NOT_FOUND_404);
        return;
    }

    postRepository.delPostById(id);
    res.sendStatus(StatusCode.NO_CONTENT_204);
}