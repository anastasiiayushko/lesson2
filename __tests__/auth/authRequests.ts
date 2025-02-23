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
    loginWithUserAgent: async (loginOrEmail: string, password: string, userAgent: string): ResponseBodySuperTest<{
        accessToken: string
    } | null> => {
        let res = await request(app).post(URL + '/login').set('User-Agent', userAgent).send({loginOrEmail, password});
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

    refreshToken: async (cookies: string[]): ResponseBodySuperTest<ApiErrorResultType | null> => {
        return await request(app).post(URL + '/refresh-token').set('Cookie', cookies.join('; '))
    },
    logout: async (cookies: string[]): ResponseBodySuperTest<ApiErrorResultType | null> => {
        return await request(app).post(URL + '/logout').set('Cookie', cookies.join('; '))

    },
    passwordRecovery: async (email: string): ResponseBodySuperTest<ApiErrorResultType | null> => {
        return await request(app).post(URL + '/password-recovery').send({email: email})
    },
    newPassword: async ({newPassword, recoveryCode}: {
        newPassword: string,
        recoveryCode: string
    }): ResponseBodySuperTest<ApiErrorResultType | null> => {
        return await request(app).post(URL + '/new-password').send({
            newPassword: newPassword,
            recoveryCode: recoveryCode
        })
    },

}