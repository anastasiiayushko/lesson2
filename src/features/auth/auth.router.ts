import express from "express";
import {AuthController} from "./controller/AuthController";
import {loginValidator} from "./middlewares/authValidate";
import {validateInputMiddleware} from "../../middlewares/validateInputMiddleware";

const authRouter = express.Router();

const authController = new AuthController();
authRouter.post('/login', loginValidator, validateInputMiddleware, authController.loginInSystem);

export default authRouter;
