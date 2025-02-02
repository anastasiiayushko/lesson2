import request, {Response} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {BlogSchemaType} from "../../src/db/types/db-blog-type";
import {UserAuthMeModelViewType, UserInputModel} from "../../src/types/input-output-types/user-types";
import {ApiErrorResultType} from "../../src/types/output-error-types";

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
    authRegistration: async (userInput: UserInputModel): ResponseBodySuperTest<ApiErrorResultType | null> => {
        return await request(app).post(URL + '/registration').send(userInput)
    },
    authEmailConfirmed: async (code: string): ResponseBodySuperTest<ApiErrorResultType | null> => {
        return await request(app).post(URL + '/registration-confirmation').send({code: code})
    },
    authEmailResending: async (email: string): ResponseBodySuperTest<ApiErrorResultType | null> => {
        return await request(app).post(URL + '/registration-email-resending').send({email: email})
    },


}