import {Router} from "express";
import {getPostByIdController} from "./controllers/getPostByIdController";
import {getPostsController} from "./controllers/getPostsController";
import {createPostController} from "./controllers/createPostController";
import {postValidate} from "./middlewares/postValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {putPostByIdController} from "./controllers/putPostByIdController";
import {delPostByIdController} from "./controllers/delPostByIdController";

export const postRouter = Router();

postRouter.get('/', getPostsController);
postRouter.get('/:id', getPostByIdController);

//protected
postRouter.post('/', adminAuthMiddleware,  ...postValidate, validateInputMiddleware, createPostController);
postRouter.put('/:id', adminAuthMiddleware,  ...postValidate, validateInputMiddleware, putPostByIdController);
postRouter.delete('/:id', adminAuthMiddleware,  delPostByIdController);