import {testingRequests} from "../../testing/testingRequests";
import {userRequests} from "../../users/userRequests";
import {authRequests} from "../authRequests";
import {StatusCode} from "../../../src/types/status-code-types";
import {ApiErrorResultType} from "../../../src/types/output-error-types";
import {getAuthHeaderBasicTest, getRefreshTokenByHeadersCookies} from "../../helpers/testUtils";
import {SETTINGS} from "../../../src/settings";
import {jwtService} from "../../../src/app/jwtService";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";

const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const userInSystem = {
    email: "test@test.com",
    login: "test",
    password: "test123456",
}

describe('Auth logout', () => {

    beforeAll(async () => {
        await testingRequests.resetAll();
        await userRequests.createUser(BASIC_VALID_HEADER, userInSystem)
    });

    it('Should be return 204 successful logout', async () => {
        let loginRes = await authRequests.login(userInSystem.login, userInSystem.password)
        const cookies = loginRes.headers['set-cookie'] as string[] | string;

        expect(cookies).toBeDefined();

        const logoutRes = await authRequests.logout(cookies as string[])
        const cookiesLogout = logoutRes.headers['set-cookie']  as string[] | string;
        const refreshToken = getRefreshTokenByHeadersCookies(cookiesLogout as string[]) ;

        expect(refreshToken).toBe('');

    })


    it('Should be return 401 if incorrect field password', async () => {
        const loginRes = await authRequests.login(userInSystem.email, userInSystem.password)
        expect(loginRes.headers['set-cookie']).toBeDefined();

        const fakeRToken = await jwtService.createRefreshToken(new ObjectId().toString(), randomUUID())
        const logoutRes = await authRequests.logout([`refreshToken=${fakeRToken}`])
        expect(logoutRes.status).toBe(StatusCode.UNAUTHORIZED_401);
    })


})

