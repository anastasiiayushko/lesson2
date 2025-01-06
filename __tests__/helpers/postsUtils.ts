import {FilterType} from "../../src/db/types/db-types";
import {PostQueryInputType} from "../../src/db/types/db-post-type";
import {Express} from "express";
import request from "supertest";
import {SETTINGS} from "../../src/settings";
import {StatusCode} from "../../src/types/status-code-types";
import {app} from "../../src/app";

type POST_QUERY_TESTING = FilterType<PostQueryInputType>
export const fetchPostsWithPagingTest = async (app: Express, query?: POST_QUERY_TESTING) => {
    let _query = query ? query : {};
    const res = await request(app)
        .get(SETTINGS.PATH.POSTS)
        .query(_query)
        .expect(StatusCode.OK_200);

    return res;
}


type PostInput = {
    title: string
    content: string
    shortDescription: string
}

export const createdPostsDataForBlogId = async (app: Express, blogId: string, posts: PostInput[], basicAuth: string) => {
    for (const postData of posts) {
        const postResponse = await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': basicAuth})
            .send({...postData, blogId: blogId})

        // Проверка успешного создания поста
        expect(postResponse.statusCode).toBe(StatusCode.CREATED_201);
        expect(postResponse.body.blogId).toBe(blogId);
        expect(postResponse.body.title).toBe(postData.title);
        expect(postResponse.body.content).toBe(postData.content);
    }

}