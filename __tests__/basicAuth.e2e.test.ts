import request from "supertest";
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {adminAuthMiddleware} from "../src/middlewares/adminAuthMiddleware";
import express from "express";
import {getAuthHeaderBasicTest} from "./helpers/testUtils";
import {StatusCode} from "../src/types/status-code-types";


const authHeaderBasicInvalid = getAuthHeaderBasicTest('admin:test')
const authHeaderBasicValid = getAuthHeaderBasicTest(SETTINGS.ADMIN)
let PATH_BLOG = SETTINGS.PATH.BLOGS;

describe("Basic Auth", () => {
    it("invalid basic should be status 401", async () => {
        await request(app).delete(PATH_BLOG+'/-10002')
            .set({'Authorization': authHeaderBasicInvalid})
            .expect(StatusCode.UNAUTHORIZED_401)
    })
    it("valid basic", async () => {
        await request(app).delete(PATH_BLOG+'/-10002')
            .set({'Authorization': authHeaderBasicValid})
            .expect(StatusCode.NOT_FOUND_404)
    })

})