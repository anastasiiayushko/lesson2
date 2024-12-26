import {Router} from 'express'
import {blogValidate} from "./middlewares/blogValidate";
import {blogQueryValidate} from "./middlewares/blogQueryValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {BlogController} from "./controllers/blogController";
import {postValidateWithoutBlogId} from "../post/middlewares/postValidate";


export const blogRouter = Router();

const blogController = new BlogController();

blogRouter.get('/', ...blogQueryValidate, validateInputMiddleware, blogController.getBlogsWithPaging);
blogRouter.get('/:id', blogController.getBlogById);

/** protected points */
blogRouter.post('/', adminAuthMiddleware, ...blogValidate, validateInputMiddleware, blogController.createBlog);
blogRouter.put('/:id', adminAuthMiddleware, ...blogValidate, validateInputMiddleware, blogController.updateBlogById);
blogRouter.delete('/:id', adminAuthMiddleware, blogController.deleteBlogById);


blogRouter.post('/:blogId/posts', adminAuthMiddleware, ...postValidateWithoutBlogId, validateInputMiddleware, blogController.createPostForSpecificBlog);
