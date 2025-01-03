import {Router} from 'express'
import {blogValidate} from "./middlewares/blogValidate";
import {blogQueryValidate} from "./middlewares/blogQueryValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {BlogController} from "./controllers/blogController";
import {postValidateWithoutBlogId} from "../post/middlewares/postValidate";
import {postQueryValidate} from "../post/middlewares/postQueryValidate";


export const blogRouter = Router();

const blogController = new BlogController();

/** returns blogs with paging */
blogRouter.get('/', ...blogQueryValidate, validateInputMiddleware, blogController.getBlogsWithPaging);
/** returns blogs by id*/
blogRouter.get('/:id', blogController.getBlogById);
/** returns all posts for specified blog */
blogRouter.get('/:blogId/posts', ...postQueryValidate, validateInputMiddleware, blogController.getPostsByBlogIdWithPaging);


/** protected points */
/** create new blog*/
blogRouter.post('/', adminAuthMiddleware, ...blogValidate, validateInputMiddleware, blogController.createBlog);
blogRouter.put('/:id', adminAuthMiddleware, ...blogValidate, validateInputMiddleware, blogController.updateBlogById);

blogRouter.delete('/:id', adminAuthMiddleware, blogController.deleteBlogById);
/**  create new post for specific blog */
blogRouter.post('/:blogId/posts', adminAuthMiddleware, ...postValidateWithoutBlogId, validateInputMiddleware, blogController.createPostForSpecificBlog);
