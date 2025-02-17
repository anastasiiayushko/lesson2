import {testingRequests} from "../../testing/testingRequests";
import {userRequests} from "../../users/userRequests";
import {authRequests} from "../authRequests";
import {StatusCode} from "../../../src/types/status-code-types";
import {ApiErrorResultType} from "../../../src/types/output-error-types";
import {getAuthHeaderBasicTest, getRefreshTokenByHeadersCookies} from "../../helpers/testUtils";
import {SETTINGS} from "../../../src/settings";

const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const userInSystem = {
    email: "test@test.com",
    login: "test",
    password: "test123456",
}

describe('Auth login', () => {

    beforeAll(async () => {
        await testingRequests.resetAll();
        await userRequests.createUser(BASIC_VALID_HEADER, userInSystem)
    });

    it('Should be return 200 in correct login and password', async () => {
        let loginRes = await authRequests.login(userInSystem.login, userInSystem.password)

        expect(loginRes.status).toBe(StatusCode.OK_200)
        expect(loginRes.body.accessToken).toEqual(expect.any(String));
        const cookies = loginRes.headers['set-cookie'] as string[] | string;
        const refreshToken = getRefreshTokenByHeadersCookies(Array.isArray(cookies) ? cookies : [cookies]);
        expect(refreshToken).toBeDefined();

    })

    it("Should be return 401 if field loginOrEmail don't existing in system", async () => {
        let loginRes = await authRequests.login('noLogin', userInSystem.password)
        expect(loginRes.status).toBe(StatusCode.UNAUTHORIZED_401);
    })

    it('Should be return 401 if incorrect field password', async () => {
        let loginRes = await authRequests.login(userInSystem.email, userInSystem.password + '1234')
        expect(loginRes.status).toBe(StatusCode.UNAUTHORIZED_401);
    })
    it('Should be return 400 if incorrect field loginOrEmail or password', async () => {
        let loginRes = await authRequests.login('', userInSystem.password)
        expect(loginRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(loginRes.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: "loginOrEmail", message: expect.any(String)}
            ]
        })

        let passRes = await authRequests.login(userInSystem.email, '')
        expect(passRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(passRes.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: "password", message: expect.any(String)}
            ]
        })

    })

    it('Should return 429 if more than 5 requests in 10 seconds', async () => {

        for (let i = 0; i < 5; i++) {
            await authRequests.login("test", "test123456"); // Или другой эндпоинт
        }

        // Делаем еще один запрос, чтобы превысить лимит
        const res = await authRequests.login("test", "test123456");

        // Проверяем, что статус 429 (слишком много запросов)
        expect(res.status).toBe(StatusCode.MANY_REQUEST_429);
    });

})

