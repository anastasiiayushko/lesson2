import {Router} from "express";
import {postValidate} from "./middlewares/postValidate";
import {postQueryValidate} from "./middlewares/postQueryValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {PostController} from "./controllers/postController";
import {CommentsController} from "../comment/controller/CommentsController";
import {commentValidate} from "../comment/middlewares/commentValidate";
import {tokenAuthMiddleware} from "../../middlewares/tokenAuthMiddleware";
import {commentsQueryValidate} from "../comment/middlewares/commentQueryValidate";

export const postRouter = Router();

const postController = new PostController();


const commentsController = new CommentsController();

postRouter.get('/', ...postQueryValidate, validateInputMiddleware, postController.getPostsWithPaging);
postRouter.get('/:id', postController.getPost);
postRouter.get('/:postId/comments', ...commentsQueryValidate, validateInputMiddleware, commentsController.getCommentsByPostIdWithPaging);


//protected
postRouter.post('/', adminAuthMiddleware, ...postValidate, validateInputMiddleware, postController.createPost);
postRouter.put('/:id', adminAuthMiddleware, ...postValidate, validateInputMiddleware, postController.updatePost);
postRouter.delete('/:id', adminAuthMiddleware, postController.deletePost);

//protected bearer token
postRouter.post('/:postId/comments', tokenAuthMiddleware, ...commentValidate, validateInputMiddleware, commentsController.createComment);