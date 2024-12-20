import {Router} from 'express'
import {bodyValidate} from "./middlewares/blogValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {BlogController} from "./controllers/blogController";


export const blogRouter = Router();

const blogController = new BlogController();

blogRouter.get('/', blogController.getBlogs);
blogRouter.get('/:id', blogController.getBlogById);

/** protected points */
blogRouter.post('/', adminAuthMiddleware, ...bodyValidate, validateInputMiddleware, blogController.createBlog);
blogRouter.put('/:id', adminAuthMiddleware, ...bodyValidate, validateInputMiddleware, blogController.updateBlogById);
blogRouter.delete('/:id', adminAuthMiddleware, blogController.deleteBlogById);