import {Router} from 'express';
import {UserController} from "./controller/UserController";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {userValidateRegistration} from "./middlewares/userValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";
import {container} from "../../inversify.config";

const userRouter = Router();

const userController = container.resolve(UserController);

/** protected */
userRouter.get('/', adminAuthMiddleware, userController.getUsersWithPaging.bind(userController))
userRouter.post('/', adminAuthMiddleware, ...userValidateRegistration, validateInputMiddleware, userController.createUser.bind(userController));
userRouter.delete('/:id', adminAuthMiddleware, userController.deleteUserById.bind(userController));
export default userRouter;