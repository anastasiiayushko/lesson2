import {getAuthHeaderBasicTest, getRefreshTokenByHeadersCookies} from "../../helpers/testUtils";
import {SETTINGS} from "../../../src/settings";
import {testingRequests} from "../../testing/testingRequests";
import {userRequests} from "../../users/userRequests";
import {authRequests} from "../../auth/authRequests";
import {StatusCode} from "../../../src/types/status-code-types";
import {deviceSessionsRequests} from "../deviceSessionsRequests";

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
describe('Device sessions create', () => {

    beforeEach(async () => {
        await testingRequests.resetAll();
        await userRequests.createUser(BASIC_VALID_HEADER, userNika);
        await userRequests.createUser(BASIC_VALID_HEADER, userIgor);
    });
    afterAll(async () => {
        await testingRequests.resetAll();
    });

    it('Should be add new device session after successful login', async () => {
        let loginRes = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')

        expect(loginRes.status).toBe(StatusCode.OK_200)
        expect(loginRes.body.accessToken).toEqual(expect.any(String));
        const cookies = loginRes.headers['set-cookie'] as string[] | string;
        const refreshToken = getRefreshTokenByHeadersCookies(Array.isArray(cookies) ? cookies : [cookies]);
        expect(refreshToken).toBeDefined();

        const resultGetAllDevice = await deviceSessionsRequests.getAllDeviceSessions(Array.isArray(cookies) ? cookies : [cookies]);

        expect(resultGetAllDevice.status).toBe(StatusCode.OK_200);
        expect(resultGetAllDevice.body.length).toEqual(1);

    })
//Логин с другого устройства добавляет новую запись в список сессий.
    it('Should create a new device session when logging in from another device', async () => {
        const userNikaResChrome = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')
        const cookiesChrome = userNikaResChrome.headers['set-cookie'] as string[] | string;
        expect(cookiesChrome).toBeDefined();

        const userNikaResIphone = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'iphone')
        const cookiesIphone = userNikaResIphone.headers['set-cookie'] as string[] | string;
        expect(cookiesIphone).toBeDefined();

        const resultGetAllDevice =
            await deviceSessionsRequests.getAllDeviceSessions(Array.isArray(cookiesIphone) ? cookiesIphone : [cookiesIphone]);

        expect(resultGetAllDevice.status).toBe(StatusCode.OK_200);
        expect(resultGetAllDevice.body.length).toEqual(2);

    })
})
