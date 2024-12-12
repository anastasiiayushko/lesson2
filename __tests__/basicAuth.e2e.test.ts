import request from "supertest";
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {adminAuthMiddleware} from "../src/middlewares/adminAuthMiddleware";
import express from "express";

const pathBlogs = SETTINGS.PATH.BLOGS;


describe("Basic Auth", () => {
it("ok", ()=>{
    expect(1).toBe(1)
})
    // it("not has headers authorization for protected point. await status 401", async () => {
    //     await request(app)
    //         .get(`/protected`)
    //         .expect(401)
    // });
    // it("not has headers authorization for protected point. await status 401", async () => {
    //     let authHeader = SETTINGS.ADMIN;
    //     await request(app)
    //         .set('Authorization', 'InvalidHeader')
    //         .get(`/protected`)
    //         .expect(401)
    // });
})