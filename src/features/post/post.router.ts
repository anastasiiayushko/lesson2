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
import {container} from "../../inversify.config";
import {extractUserIdMiddleware} from "../../middlewares/extractUserIdMiddleware";

export const postRouter = Router();

// const postController = ioc.getInstance<PostController>(PostController)
const postController = container.resolve(PostController);

const commentsController = container.resolve(CommentsController);

postRouter.get('/', ...postQueryValidate, validateInputMiddleware, postController.getPostsWithPaging.bind(postController));
postRouter.get('/:id', postController.getPost.bind(postController));
postRouter.get('/:postId/comments', ...commentsQueryValidate, validateInputMiddleware, extractUserIdMiddleware, commentsController.getCommentsByPostIdWithPaging.bind(commentsController));


//protected
postRouter.post('/', adminAuthMiddleware, ...postValidate, validateInputMiddleware, postController.createPost.bind(postController));
postRouter.put('/:id', adminAuthMiddleware, ...postValidate, validateInputMiddleware, postController.updatePost.bind(postController));
postRouter.delete('/:id', adminAuthMiddleware, postController.deletePost.bind(postController));

//protected bearer token
postRouter.post('/:postId/comments', tokenAuthMiddleware, ...commentValidate, validateInputMiddleware, commentsController.createComment.bind(commentsController));


