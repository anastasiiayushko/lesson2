import {Router} from 'express';
import {CommentsController} from "./controller/CommentsController";
import {commentValidate} from "./middlewares/commentValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {tokenAuthMiddleware} from "../../middlewares/tokenAuthMiddleware";
import {container} from "../../inversify.config";

const commentRouter = Router();
const commentsController = container.resolve(CommentsController);

/* protected **/

commentRouter.get('/:id', commentsController.getCommentById.bind(commentsController));
commentRouter.put('/:commentId', tokenAuthMiddleware, ...commentValidate, validateInputMiddleware, commentsController.updateCommentsById.bind(commentsController));
commentRouter.delete('/:commentId', tokenAuthMiddleware, commentsController.deleteCommentById.bind(commentsController));



export default commentRouter;