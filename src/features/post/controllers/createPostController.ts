import {Response, Request} from "express";
import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
import {PostRepository} from "../postRepository";
import {BlogRepository} from "../../blog/blogRepository";
import {BlogViewModel} from "../../../types/input-output-types/blog-types";
import {StatusCode} from "../../../types/status-code-types";

const postRepository = new PostRepository();
const blogRepository = new BlogRepository();
export const createPostController = (req: Request<{}, {}, PostInputModel>,
                                     res: Response<PostViewModel>) => {

    let body = req.body;
    let blog = blogRepository.getById(body.blogId) as BlogViewModel;

    let postData = {
        title: body.title,
        shortDescription: body.shortDescription,
        content: body.content,
        blogId: blog.id,
        blogName: blog.name
    }
    let createdPost = postRepository.createPost(postData);

    res.status(StatusCode.CREATED_201).json(createdPost);

}