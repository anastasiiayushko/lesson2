import {FilterType} from "../../src/db/types/db-types";
import {PostQueryInputType} from "../../src/db/types/db-post-type";
import {Express} from "express";
import request from "supertest";
import {SETTINGS} from "../../src/settings";
import {StatusCode} from "../../src/types/status-code-types";

type POST_QUERY_TESTING = FilterType<PostQueryInputType>
export const fetchPostsWithPagingTest = async (app: Express, query?: POST_QUERY_TESTING) => {
    let _query = query ? query : {};
    const res = await request(app)
        .get(SETTINGS.PATH.POSTS)
        .query(_query)
        .expect(StatusCode.OK_200);

    return res;
}
