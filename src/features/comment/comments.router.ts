import {Router} from 'express';
import {CommentsController} from "./controller/CommentsController";
import {commentValidate, likeStatusValidate} from "./middlewares/commentValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {tokenAuthMiddleware} from "../../middlewares/tokenAuthMiddleware";
import {container} from "../../inversify.config";
import {extractUserIdMiddleware} from "../../middlewares/extractUserIdMiddleware";

const commentRouter = Router();
const commentsController = container.resolve(CommentsController);

/* protected **/

commentRouter.get('/:id', extractUserIdMiddleware, commentsController.getCommentById.bind(commentsController));
commentRouter.put('/:commentId', tokenAuthMiddleware, ...commentValidate, validateInputMiddleware, commentsController.updateCommentsById.bind(commentsController));
commentRouter.delete('/:commentId', tokenAuthMiddleware, commentsController.deleteCommentById.bind(commentsController));

commentRouter.put('/:commentId/like-status', tokenAuthMiddleware, likeStatusValidate, validateInputMiddleware, commentsController.setLikeComment.bind(commentsController));


export default commentRouter;