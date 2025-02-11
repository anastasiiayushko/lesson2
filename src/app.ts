import express from "express";
import {SETTINGS} from "./settings";
import {blogRouter} from "./features/blog/blog.router";
import {testRouter} from "./features/test/test.router";
import {postRouter} from "./features/post/post.router";
import userRouter from "./features/user/user.router";
import authRouter from "./features/auth/auth.router";
import commentRouter from "./features/comment/comments.router";
import cookieParser from "cookie-parser";
import securityRouter from "./features/sessions/security.router";

export const app = express();

app.set('trust proxy', true)
app.use(express.json())
app.use(cookieParser())

app.use(SETTINGS.PATH.BLOGS, blogRouter);
app.use(SETTINGS.PATH.POSTS, postRouter);
app.use(SETTINGS.PATH.USERS, userRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.COMMENTS, commentRouter);
app.use(SETTINGS.PATH.SECURITY, securityRouter);
app.use(SETTINGS.PATH.TESTING, testRouter);

app.get('/', (req, res) => {
    res.send()
});
