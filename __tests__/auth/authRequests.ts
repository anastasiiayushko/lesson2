import request, {Response} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {BlogSchemaType} from "../../src/db/types/db-blog-type";
import {UserAuthMeModelViewType} from "../../src/types/input-output-types/user-types";

const URL = SETTINGS.PATH.AUTH;

export type ResponseBodySuperTest<T = null> = Promise<Response & { body: T }>

export const authRequests = {
    login: async (loginOrEmail: string, password: string): ResponseBodySuperTest<{ accessToken: string } | null> => {
        let res = await request(app).post(URL + '/login').send({loginOrEmail, password});
        return res;

    },
    me: async (blogEntry: BlogSchemaType[]): ResponseBodySuperTest<UserAuthMeModelViewType> => {
        return await request(app).post(URL + '/me').send(blogEntry)

    },

}