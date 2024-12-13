import {Response, Request} from "express";
import {PostRepository} from "../postRepository";
import {PostViewModel} from "../../../types/input-output-types/post-types";
import {StatusCode} from "../../../types/status-code-types";


const postRepository = new PostRepository();
export const getPostByIdController = (req: Request<{ id: string }>,
                                      res: Response<PostViewModel>) => {
    let id = req.params.id;
    let post = postRepository.getById(id);
    if (!post) {
        res.sendStatus(StatusCode.NOT_FOUND_404);
        return;
    }
    res.status(StatusCode.OK_200).json(post);
}