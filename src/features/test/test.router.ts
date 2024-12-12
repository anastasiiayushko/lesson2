import {Router} from "express";
import {setDB} from "../../db/db";
import {StatusCode} from "../../types/status-code-types";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";

export const testRouter = Router();

testRouter.delete('/all-data', (req, res) => {
    setDB(null)
    res.sendStatus(StatusCode.NO_CONTENT_204)

})

testRouter.get('/protected', adminAuthMiddleware, (req, res) => {
    res.sendStatus(StatusCode.NO_CONTENT_204)
})