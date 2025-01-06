import {getAuthHeaderBasicTest, resetTestData} from "./helpers/testUtils";
import request from "supertest";
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {StatusCode} from "../src/types/status-code-types";
import {ApiErrorResultType} from "../src/types/output-error-types";

const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const userInSystem = {
    email: "test@test.com",
    login: "test",
    password: "test123456",
}

describe('Auth login', () => {

    beforeAll(async () => {
        await resetTestData(app)
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': BASIC_VALID_HEADER})
            .send(userInSystem)
            .expect(StatusCode.CREATED_201);
    });

    it('Should be return 204 in correct login and password', async () => {
        await request(app).post(SETTINGS.PATH.AUTH + '/login')
            .send({
                loginOrEmail: userInSystem.login,
                password: userInSystem.password
            }).expect(StatusCode.NO_CONTENT_204)

    })
    it('Should be return 204 in correct email and password', async () => {
        await request(app).post(SETTINGS.PATH.AUTH + '/login')
            .send({
                loginOrEmail: userInSystem.email,
                password: userInSystem.password
            }).expect(StatusCode.NO_CONTENT_204)

    })
    it('Should be return 204 incorrect field loginOrEmail', async () => {
        let res = await request(app).post(SETTINGS.PATH.AUTH + '/login')
            .send({
                loginOrEmail: "",
                password: userInSystem.password
            })
        expect(res.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(res.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: "loginOrEmail", message: expect.any(String)}
            ]
        })

    })

    it('Should be return 204 incorrect field password', async () => {
        let res = await request(app).post(SETTINGS.PATH.AUTH + '/login')
            .send({
                loginOrEmail: "adfsf",
                password: ""
            })
        expect(res.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(res.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: "password", message: expect.any(String)}
            ]
        })

    })

    it('Should be return 401 incorrect password or login', async () => {
        await request(app).post(SETTINGS.PATH.AUTH + '/login')
            .send({
                loginOrEmail: "wrongLoginOrEmail",
                password: userInSystem.password
            }).expect(StatusCode.UNAUTHORIZED_401);

        await request(app).post(SETTINGS.PATH.AUTH + '/login')
            .send({
                loginOrEmail: userInSystem.email,
                password: 'wrongPassword'
            }).expect(StatusCode.UNAUTHORIZED_401);
    })
})

