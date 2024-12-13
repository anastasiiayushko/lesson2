import {Response, Request} from "express";
import {BlogViewModel} from "../../../types/input-output-types/blog-types";
import {StatusCode} from "../../../types/status-code-types";
import {PostRepository} from "../postRepository";
import {BlogRepository} from "../../blog/blogRepository";

const postRepository = new PostRepository();
const blogRepository = new BlogRepository();
export const putPostByIdController = (req: Request<{ id: string }>,
                                      res: Response) => {
    let postId = req.params.id;
    let body = req.body;
    let blog = blogRepository.getById(body.blogId) as BlogViewModel;
    let post = postRepository.getById(postId);
    if (!post) {
        res.sendStatus(StatusCode.NOT_FOUND_404);
        return;
    }
    let postData = {
        title: body.title,
        shortDescription: body.shortDescription,
        content: body.content,
        blogId: blog.id,
        blogName: blog.name
    }

    postRepository.updatePostById(postId, postData);

    res.sendStatus(StatusCode.NO_CONTENT_204);
}