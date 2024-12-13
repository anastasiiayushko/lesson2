import {Response, Request} from "express";
import {PostViewModel} from "../../../types/input-output-types/post-types";
import {PostRepository} from "../postRepository"
import {StatusCode} from "../../../types/status-code-types";

const postRepository = new PostRepository();
export const getPostsController = (req: Request, res: Response<PostViewModel[]>) => {
    let posts = postRepository.getAll();
    res.status(StatusCode.OK_200).json(posts);
}