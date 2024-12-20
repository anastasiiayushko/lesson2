import {Router} from "express";
import {resetDB} from "../../db/db";
import {StatusCode} from "../../types/status-code-types";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";

export const testRouter = Router();

testRouter.delete('/all-data', async (req, res) => {
    await resetDB();
    res.sendStatus(StatusCode.NO_CONTENT_204)

})

testRouter.get('/protected', adminAuthMiddleware, (req, res) => {
    res.sendStatus(StatusCode.NO_CONTENT_204)
})