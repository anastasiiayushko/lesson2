import express from "express";
import {SETTINGS} from "./settings";
import {blogRouter} from "./features/blog/blog.router";
import {testRouter} from "./features/test/test.router";
import {postRouter} from "./features/post/post.router";

export const app = express();

app.use(express.json())

app.use(SETTINGS.PATH.BLOGS, blogRouter);
app.use(SETTINGS.PATH.POSTS, postRouter);
app.use(SETTINGS.PATH.TESTING, testRouter);

app.get('/', (req, res) => {
    res.sendStatus(204);
});
