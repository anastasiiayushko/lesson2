import {Router} from "express";
import {postValidate} from "./middlewares/postValidate";
import {postQueryValidate} from "./middlewares/postQueryValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {PostController} from "./controllers/postController";

export const postRouter = Router();

const postController = new PostController();

postRouter.get('/', ...postQueryValidate, validateInputMiddleware, postController.getPostsWithPaging);
postRouter.get('/:id', postController.getPost);

//protected
postRouter.post('/', adminAuthMiddleware, ...postValidate, validateInputMiddleware, postController.createPost);
postRouter.put('/:id', adminAuthMiddleware, ...postValidate, validateInputMiddleware, postController.updatePost);
postRouter.delete('/:id', adminAuthMiddleware, postController.deletePost);