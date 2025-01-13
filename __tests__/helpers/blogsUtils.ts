import {FilterType} from "../../src/db/types/db-types";
import {BlogQueryInputType} from "../../src/db/types/db-blog-type";
import {Express} from "express";
import request, {Response} from "supertest";
import {SETTINGS} from "../../src/settings";
import {StatusCode} from "../../src/types/status-code-types";
import {BlogInputModelType} from "../../src/types/input-output-types/blog-types";
import {BLOG_INPUT_VALID} from "./testData";
import {PostQueryInputType} from "../../src/db/types/db-post-type";


type BLOG_QUERY_TESTING = FilterType<BlogQueryInputType>

export const fetchBlogsWithPagingTest = async (app: Express, query?: BLOG_QUERY_TESTING) => {
    let _query = query ? query : {};

    const res = await request(app)
        .get(SETTINGS.PATH.BLOGS)
        .query(_query)
        .expect(StatusCode.OK_200);

    return res;
}

type POST_QUERY_TESTING = FilterType<PostQueryInputType>
export const fetchPostsByBlogIdWithPagingTest = async (app: Express, blogId:string, query?: POST_QUERY_TESTING) => {
    let _query = query ? query : {};

    const res = await request(app)
        .get(SETTINGS.PATH.BLOGS+"/"+blogId+"/posts")
        .query(_query)
        .expect(StatusCode.OK_200);

    return res;
}

//::TODO set ts for response
export const createBlogTestRequest = async (
    app: Express,
    blogData: BlogInputModelType | {} = BLOG_INPUT_VALID,

    // basicAuth: string): Promise<BlogViewModelType> => {
    basicAuth: string): Promise<Response> => {
    const response = await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .set({'Authorization': basicAuth})
        .send(blogData)
    return response
};