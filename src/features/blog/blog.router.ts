import {Router} from 'express'
import {getBlogsController} from "./controllers/getBlogsController";
import {createBlogController} from "./controllers/createBlogController";
import {putBlogByIdController} from "./controllers/putBlogByIdController";
import {delBlogByIdController} from "./controllers/delBlogByIdController";
import {bodyValidate} from "./middlewares/blogValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {getBlogByIdController} from "./controllers/getBlogByIdController";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";


export const blogRouter = Router();

blogRouter.get('/', getBlogsController);
blogRouter.get('/:id', getBlogByIdController);

/** protected points */
blogRouter.post('/', adminAuthMiddleware, ...bodyValidate, validateInputMiddleware, createBlogController);
blogRouter.put('/:id', adminAuthMiddleware, ...bodyValidate, validateInputMiddleware, putBlogByIdController);
blogRouter.delete('/:id', adminAuthMiddleware, delBlogByIdController);