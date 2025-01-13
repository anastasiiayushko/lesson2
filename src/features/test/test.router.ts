import {Router} from "express";
import {blogCollection, postCollection, resetDB, userCollection} from "../../db/db";
import {StatusCode} from "../../types/status-code-types";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {blogDataTest} from "./blogData"

export const testRouter = Router();

testRouter.delete('/all-data', async (req, res) => {
    await resetDB();
    res.sendStatus(StatusCode.NO_CONTENT_204)

})

testRouter.post('/blogs/insertMany', async (req, res) => {
    await blogCollection.insertMany(blogDataTest)
    res.sendStatus(StatusCode.NO_CONTENT_204)

});
testRouter.post('/posts/insert', async (req, res) => {
    await postCollection.insertMany(req.body)
    let posts = await postCollection.find().toArray()
    res.status(StatusCode.OK_200).json(posts)

});
testRouter.post('/blogs/insert', async (req, res) => {
    let bodyInsert = req.body;
    await blogCollection.insertMany(bodyInsert)
    let blogs = await blogCollection.find({}).toArray()
    res.status(StatusCode.OK_200).json(blogs)

});
testRouter.post('/users/insert', async (req, res) => {
    let bodyInsert = req.body;
    await userCollection.insertMany(bodyInsert)
    let result = await userCollection.find().toArray()
    res.json(result)

});
testRouter.get('/protected', adminAuthMiddleware, (req, res) => {
    res.sendStatus(StatusCode.NO_CONTENT_204)
})