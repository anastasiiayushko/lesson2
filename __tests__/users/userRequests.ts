import request, {Response} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {UserInputModel, UserQueryInputType, UserSecureViewModel} from "../../src/types/input-output-types/user-types";
import {ApiErrorResultType} from "../../src/types/output-error-types";
import {PaginationViewModelType} from "../../src/types/input-output-types/pagination-output-types";

const URL = SETTINGS.PATH.USERS;

export type ResponseBodySuperTest<T = null> = Promise<Response & { body: T }>

export const userRequests = {

    createUser: async (authBasic: string, data: UserInputModel): ResponseBodySuperTest<UserSecureViewModel | ApiErrorResultType> => {
        return request(app).post(URL)
            .set("Authorization", authBasic)
            .send(data);
    },
    deleteUser: async (authBasic: string, userId: string): ResponseBodySuperTest => {
        let url = `${URL}/${userId}`
        return request(app).delete(url)
            .set("Authorization", authBasic)
    },
    usersPaging: async (authBasic: string, query: Partial<UserQueryInputType>)
        : ResponseBodySuperTest<PaginationViewModelType<UserSecureViewModel>> => {
        let _query = query ? query : {};
        return await request(app)
            .get(SETTINGS.PATH.USERS)
            .query(_query)
            .set({Authorization: authBasic})
    }

}
