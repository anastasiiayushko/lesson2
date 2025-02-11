import {getAuthHeaderBasicTest, getRefreshTokenByHeadersCookies} from "../../helpers/testUtils";
import {SETTINGS} from "../../../src/settings";
import {testingRequests} from "../../testing/testingRequests";
import {userRequests} from "../../users/userRequests";
import {authRequests} from "../../auth/authRequests";
import {StatusCode} from "../../../src/types/status-code-types";
import {deviceSessionsRequests} from "../deviceSessionsRequests";
import jwt from "jsonwebtoken";
import {jwtService} from "../../../src/app/jwtService";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";

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
describe('Device sessions delete', () => {

    beforeEach(async () => {
        await testingRequests.resetAll();
        await userRequests.createUser(BASIC_VALID_HEADER, userNika);
        await userRequests.createUser(BASIC_VALID_HEADER, userIgor);
    });

    it('Should delete all other device sessions except the current one', async () => {
        await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')
        await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')
        const loginRes3 = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')

        const cookies3 = Array.isArray(loginRes3.headers['set-cookie']) ? loginRes3.headers['set-cookie'] : [loginRes3.headers['set-cookie']];
        expect(cookies3).toBeDefined();

        const resultGetAllDevice = await deviceSessionsRequests.getAllDeviceSessions(cookies3);
        expect(resultGetAllDevice.body.length).toEqual(3);

        const resultDeleteOtherDeviceSessions = await deviceSessionsRequests.deleteAllOtherDeviceSessions(cookies3);
        expect(resultDeleteOtherDeviceSessions.status).toBe(StatusCode.NO_CONTENT_204);

        const resGetAllDevice2 = await deviceSessionsRequests.getAllDeviceSessions(cookies3);
        const refreshTokenLogin3 = getRefreshTokenByHeadersCookies(cookies3) as string;
        const decodeLoginRes3Token = await jwtService.decodeToken(refreshTokenLogin3);

        expect(resGetAllDevice2.body.length).toEqual(1);
        expect(resGetAllDevice2.body[0].deviceId).toEqual(decodeLoginRes3Token.deviceId);
        expect(resGetAllDevice2.body[0].userId).toEqual(loginRes3.body.userId);

    });

    it('Should return 401 when trying to delete all other device sessions, with invalid cookies', async () => {
        const resNikaLogin = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')
        const cookiesNika = Array.isArray(resNikaLogin.headers['set-cookie']) ? resNikaLogin.headers['set-cookie'] : [resNikaLogin.headers['set-cookie']];
        expect(cookiesNika).toBeDefined();

        const NoExistRefreshToken = await jwtService.createRefreshToken(new ObjectId().toString(), randomUUID())

        const resultGetAllDeviceByNika = await deviceSessionsRequests.getAllDeviceSessions(cookiesNika);
        expect(resultGetAllDeviceByNika.body.length).toEqual(1);

        const resultDeleteOtherDeviceSessions = await deviceSessionsRequests.deleteAllOtherDeviceSessions([`refreshToken=${NoExistRefreshToken}`]);
        expect(resultDeleteOtherDeviceSessions.status).toBe(StatusCode.UNAUTHORIZED_401);

        const resGetAllDevice2 = await deviceSessionsRequests.getAllDeviceSessions(cookiesNika);
        expect(resGetAllDevice2.body.length).toEqual(1);

    });


    //Указанная сессия должна быть удалена.
    it('Should be successful delete a specific device session by deviceId', async () => {
        const loginRes1 = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome');
        const cookies1 = Array.isArray(loginRes1.headers['set-cookie']) ? loginRes1.headers['set-cookie'] : [loginRes1.headers['set-cookie']];
        const refreshTokenLogin1 = getRefreshTokenByHeadersCookies(cookies1);
        expect(refreshTokenLogin1).toBeDefined();

        const decodeRToken1 = await jwtService.decodeToken(refreshTokenLogin1 as string);
        const deviceIdLogin1 = decodeRToken1!.deviceId as string;

        const loginRes2 = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')
        const cookies2 = Array.isArray(loginRes2.headers['set-cookie']) ? loginRes2.headers['set-cookie'] : [loginRes2.headers['set-cookie']];
        expect(cookies2).toBeDefined();

        const resBeforeGetAllDevices = await deviceSessionsRequests.getAllDeviceSessions(cookies2);
        expect(resBeforeGetAllDevices.body.length).toEqual(2);

        const resDeleteDeviceSession = await deviceSessionsRequests.deleteDeviceSessionByDeviceId(deviceIdLogin1, cookies2);
        expect(resDeleteDeviceSession.status).toBe(StatusCode.NO_CONTENT_204);

        const resAfterGetAllDevice = await deviceSessionsRequests.getAllDeviceSessions(cookies2);
        expect(resAfterGetAllDevice.body.length).toEqual(1);
    });

    //Указанная сессия должна быть удалена.
    it('Should return 401 when trying delete a specific device session by device Id with incorrect refresh Token', async () => {
        await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome')
        const loginRes1 = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome');
        const cookies1 = Array.isArray(loginRes1.headers['set-cookie']) ? loginRes1.headers['set-cookie'] : [loginRes1.headers['set-cookie']];
        expect(cookies1).toBeDefined();

        const resBeforeGetAllDevices = await deviceSessionsRequests.getAllDeviceSessions(cookies1);
        expect(resBeforeGetAllDevices.body.length).toEqual(2);

        const NoExistRefreshToken = await jwtService.createRefreshToken(new ObjectId().toString(), randomUUID())

        const resDeleteByDeviceIdWithInvalidToken = await deviceSessionsRequests.deleteDeviceSessionByDeviceId(randomUUID(), ["refreshToken=" + NoExistRefreshToken]);
        expect(resDeleteByDeviceIdWithInvalidToken.status).toBe(StatusCode.UNAUTHORIZED_401);

        const resAfterGetAllDevice = await deviceSessionsRequests.getAllDeviceSessions(cookies1);
        expect(resAfterGetAllDevice.body.length).toEqual(2);
    });

    //Указанная сессия должна быть удалена.
    it('Should return 403 when trying delete a specific device session by deviceId of other user', async () => {
        const resUserNika = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome');
        const cookiesNika = Array.isArray(resUserNika.headers['set-cookie']) ? resUserNika.headers['set-cookie'] : [resUserNika.headers['set-cookie']];
        expect(cookiesNika).toBeDefined();

        const resUserIgor = await authRequests.loginWithUserAgent(userIgor.login, userIgor.password, 'chrome');
        const cookiesIgor = Array.isArray(resUserIgor.headers['set-cookie']) ? resUserIgor.headers['set-cookie'] : [resUserIgor.headers['set-cookie']];
        expect(cookiesIgor).toBeDefined();

        const resBeforeGetAllDevicesOfIgor = await deviceSessionsRequests.getAllDeviceSessions(cookiesIgor);
        expect(resBeforeGetAllDevicesOfIgor.body.length).toEqual(1);

        const decodeTokenNika = await jwtService.decodeToken(getRefreshTokenByHeadersCookies(cookiesNika) as string);
        const resDeleteByDeviceId = await deviceSessionsRequests.deleteDeviceSessionByDeviceId(decodeTokenNika.deviceId, cookiesIgor);
        expect(resDeleteByDeviceId.status).toBe(StatusCode.FORBIDDEN_403);

        const resAfterGetAllDevicesOfIgor = await deviceSessionsRequests.getAllDeviceSessions(cookiesIgor);
        expect(resAfterGetAllDevicesOfIgor.body.length).toEqual(1);
    });

    //Указанная сессия должна быть удалена.
    it('Should return 404 when trying delete no existing a specific device session by deviceId', async () => {
        const resUserNika = await authRequests.loginWithUserAgent(userNika.login, userNika.password, 'chrome');
        const cookiesNika = Array.isArray(resUserNika.headers['set-cookie']) ? resUserNika.headers['set-cookie'] : [resUserNika.headers['set-cookie']];
        expect(cookiesNika).toBeDefined();


        const resBeforeGetAllDevices = await deviceSessionsRequests.getAllDeviceSessions(cookiesNika);
        expect(resBeforeGetAllDevices.body.length).toEqual(1);

        const resDeleteByDeviceId = await deviceSessionsRequests.deleteDeviceSessionByDeviceId(randomUUID(), cookiesNika);
        expect(resDeleteByDeviceId.status).toBe(StatusCode.NOT_FOUND_404);

        const resAfterGetAllDevices = await deviceSessionsRequests.getAllDeviceSessions(cookiesNika);
        expect(resAfterGetAllDevices.body.length).toEqual(1);
    });
})

