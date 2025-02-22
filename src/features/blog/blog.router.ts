import {Router} from 'express'
import {blogValidate} from "./middlewares/blogValidate";
import {blogQueryValidate} from "./middlewares/blogQueryValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {BlogController} from "./controllers/blogController";
import {postValidateWithoutBlogId} from "../post/middlewares/postValidate";
import {postQueryValidate} from "../post/middlewares/postQueryValidate";
import {container} from "../../inversify.config";


export const blogRouter = Router();

// const blogController = ioc.getInstance<BlogController>(BlogController);

const blogController = container.resolve(BlogController);
/** returns blogs with paging */
blogRouter.get('/', ...blogQueryValidate, validateInputMiddleware, blogController.getBlogsWithPaging.bind(blogController));
/** returns blogs by id*/
blogRouter.get('/:id', blogController.getBlogById.bind(blogController));
/** returns all posts for specified blog */
blogRouter.get('/:blogId/posts', ...postQueryValidate, validateInputMiddleware, blogController.getPostsByBlogIdWithPaging.bind(blogController));


/** protected points */
/** create new blog*/
blogRouter.post('/', adminAuthMiddleware, ...blogValidate, validateInputMiddleware, blogController.createBlog.bind(blogController));
blogRouter.put('/:id', adminAuthMiddleware, ...blogValidate, validateInputMiddleware, blogController.updateBlogById.bind(blogController));

blogRouter.delete('/:id', adminAuthMiddleware, blogController.deleteBlogById.bind(blogController));
/**  create new post for specific blog */
blogRouter.post('/:blogId/posts', adminAuthMiddleware, ...postValidateWithoutBlogId, validateInputMiddleware, blogController.createPostForSpecificBlog.bind(blogController));
