import {Router} from "express";
import {blogCollection, resetDB} from "../../db/db";
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

testRouter.post('/blogs/insert', async (req, res) => {
    let bodyInsert = req.body;
    await blogCollection.insertMany(bodyInsert)
    res.sendStatus(StatusCode.NO_CONTENT_204)

});

testRouter.get('/protected', adminAuthMiddleware, (req, res) => {
    res.sendStatus(StatusCode.NO_CONTENT_204)
})