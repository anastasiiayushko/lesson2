import {Router} from 'express';
import {CommentsController} from "./controller/CommentsController";
import {commentValidate} from "./middlewares/commentValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {tokenAuthMiddleware} from "../../middlewares/tokenAuthMiddleware";

const commentRouter = Router();
const commentsController = new CommentsController();

/* protected **/

commentRouter.get('/:id', commentsController.getCommentById);
commentRouter.put('/:commentId', tokenAuthMiddleware, ...commentValidate, validateInputMiddleware, commentsController.updateCommentsById);
commentRouter.delete('/:commentId', tokenAuthMiddleware, commentsController.deleteCommentById);

export default commentRouter;