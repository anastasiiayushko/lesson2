import {FilterType} from "../../src/db/types/db-types";
import {Express} from "express";
import request from "supertest";
import {SETTINGS} from "../../src/settings";
import {StatusCode} from "../../src/types/status-code-types";
import {UserQueryInputType} from "../../src/types/input-output-types/user-types";

type USERS_QUERY_TESTING = FilterType<UserQueryInputType>
export const fetchUsersWithPagingTest = async (app: Express, authBasic:string, query?: USERS_QUERY_TESTING) => {
    let _query = query ? query : {};
    const res = await request(app)
        .get(SETTINGS.PATH.USERS)
        .query(_query)
        .set({Authorization: authBasic})

    return res;
}
