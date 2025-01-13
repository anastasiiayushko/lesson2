import request, {Response} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {UserInputModel, UserSecureViewModel} from "../../src/types/input-output-types/user-types";
import {ApiErrorResultType} from "../../src/types/output-error-types";

const URL = SETTINGS.PATH.USERS;

export type ResponseBodySuperTest<T = null> = Promise<Response & { body: T }>

export const userRequests = {

    createUser: async (authBasic: string, data: UserInputModel): ResponseBodySuperTest<UserSecureViewModel | ApiErrorResultType> => {
        return request(app).post(URL)
            .set("Authorization", authBasic)
            .send(data);
    },
}
