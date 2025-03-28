import {Router} from "express";
import {container} from "../../../inversify.config";
import {CommentsController} from "../../comment/controller/CommentsController";
import {postQueryValidate} from "../middlewares/postQueryValidate";
import {validateInputMiddleware} from "../../../middlewares/validateInputMiddleware";
import {commentsQueryValidate} from "../../comment/middlewares/commentQueryValidate";
import {extractUserIdMiddleware} from "../../../middlewares/extractUserIdMiddleware";
import {adminAuthMiddleware} from "../../../middlewares/adminAuthMiddleware";
import {postValidate} from "../middlewares/postValidate";
import {tokenAuthMiddleware} from "../../../middlewares/tokenAuthMiddleware";
import {commentValidate, likeStatusValidate} from "../../comment/middlewares/commentValidate";
import {PostController} from "../infrastructure/postController";


export const postRouter = Router();

const postController = container.resolve(PostController);
const commentsController = container.resolve(CommentsController);

postRouter.get('/', extractUserIdMiddleware, ...postQueryValidate, validateInputMiddleware, postController.getPostsWithPaging.bind(postController));
postRouter.get('/:id', extractUserIdMiddleware, postController.getPost.bind(postController));
postRouter.get('/:postId/comments', ...commentsQueryValidate, validateInputMiddleware, extractUserIdMiddleware, commentsController.getCommentsByPostIdWithPaging.bind(commentsController));


//protected
postRouter.post('/', adminAuthMiddleware, ...postValidate, validateInputMiddleware, postController.createPost.bind(postController));
postRouter.put('/:id', adminAuthMiddleware, ...postValidate, validateInputMiddleware, postController.updatePost.bind(postController));
postRouter.delete('/:id', adminAuthMiddleware, postController.deletePost.bind(postController));
postRouter.put('/:postId/like-status', tokenAuthMiddleware, ...likeStatusValidate, validateInputMiddleware, postController.setLikeStatus.bind(postController));

//protected bearer token
postRouter.post('/:postId/comments', tokenAuthMiddleware, ...commentValidate, validateInputMiddleware, commentsController.createComment.bind(commentsController));


