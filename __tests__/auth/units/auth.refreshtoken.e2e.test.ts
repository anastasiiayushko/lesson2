import {SETTINGS} from "../../../src/settings";
import {getAuthHeaderBasicTest, getRefreshTokenByHeadersCookies} from "../../helpers/testUtils";
import {testingRequests} from "../../testing/testingRequests";
import {userRequests} from "../../users/userRequests";
import {authRequests} from "../authRequests";
import {StatusCode} from "../../../src/types/status-code-types";
import {deviceSessionsRequests} from "../../deviceSessions/deviceSessionsRequests";
import {jwtService} from "../../../src/app/jwtService";
import {randomUUID} from "crypto";
import {ObjectId} from "mongodb";


const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)

const userIgor = {
    login: "igor",
    password: "igor123456",
    email: "igor@gmail.com",
}
const userNika = {
    login: "nika",
    password: "nika123456",
    email: "nika@gmail.com",
}
describe('Auth refresh token with update device session', () => {

    beforeEach(async () => {
        await testingRequests.resetAll();
        await userRequests.createUser(BASIC_VALID_HEADER, userNika);
        await userRequests.createUser(BASIC_VALID_HEADER, userIgor);
    });

    it('Should be return 200 for update meta device', async () => {
        const loginRes = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')
        const cookies = Array.isArray(loginRes.headers['set-cookie']) ? loginRes.headers['set-cookie'] : [loginRes.headers['set-cookie']];
        expect(loginRes.status).toBe(StatusCode.OK_200);
        expect(loginRes.body.accessToken).toBeDefined();
        expect(cookies).toBeDefined();

        const resultGetAllDevice = await deviceSessionsRequests.getAllDeviceSessions(Array.isArray(cookies) ? cookies : [cookies]);
        expect(resultGetAllDevice.status).toBe(StatusCode.OK_200);
        expect(resultGetAllDevice.body.length).toEqual(1);

        const resRefreshToken = await authRequests.refreshToken(cookies);
        const cookiesUpdate = Array.isArray(resRefreshToken.headers['set-cookie']) ? resRefreshToken.headers['set-cookie'] : [resRefreshToken.headers['set-cookie']];

        expect(resRefreshToken.status).toBe(StatusCode.OK_200);
        expect(resRefreshToken.body.accessToken).toBeDefined();
        expect(cookiesUpdate).toBeDefined();

        const decodeBeforeToken = await jwtService.decodeToken(getRefreshTokenByHeadersCookies(cookies) as string);
        const decodeAfterUpdateToken = await jwtService.decodeToken(getRefreshTokenByHeadersCookies(cookiesUpdate) as string);

        expect(decodeBeforeToken.userId).toEqual(decodeAfterUpdateToken.userId);
        expect(decodeBeforeToken.deviceId).toEqual(decodeAfterUpdateToken.deviceId);
        // expect(decodeBeforeToken.iat).not.toEqual(decodeAfterUpdateToken.iat);
    })
//Логин с другого устройства добавляет новую запись в список сессий.
    it('Should be 401 if refreshToken invalid', async () => {
        const userNikaResChrome = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')
        const cookiesNika = Array.isArray(userNikaResChrome.headers['set-cookie']) ?
            userNikaResChrome.headers['set-cookie'] : [userNikaResChrome.headers['set-cookie']];
        expect(cookiesNika).toBeDefined();

        const invalidRToken = await jwtService.createRefreshToken(new ObjectId().toString(), randomUUID())
        const resInvalidRefreshToken = await authRequests.refreshToken(['refreshToken=' + invalidRToken]);

        expect(resInvalidRefreshToken.status).toBe(StatusCode.UNAUTHORIZED_401);


    })
})
