import {Router} from 'express';
import {UserController} from "./controller/UserController";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {userValidate} from "./middlewares/userValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";

const userRouter = Router();

const userController = new UserController();

/** protected */
userRouter.get('/', adminAuthMiddleware, userController.getUsersWithPaging)
userRouter.post('/', adminAuthMiddleware, ...userValidate, validateInputMiddleware, userController.createUser);
userRouter.delete('/:id', adminAuthMiddleware, userController.deleteUserById);
export default userRouter;