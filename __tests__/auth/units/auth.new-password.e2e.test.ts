import {testingRequests} from "../../testing/testingRequests";
import {userRequests} from "../../users/userRequests";
import {generateRandomStringForTest, getAuthHeaderBasicTest} from "../../helpers/testUtils";
import {SETTINGS} from "../../../src/settings";
import {StatusCode} from "../../../src/types/status-code-types";
import {authRequests} from "../authRequests";
import {userDbAdapter} from "../../users/userDbAdapter";

const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const userInSystem = {
    email: "test@test.com",
    login: "test",
    password: "test123456",
}


describe('Auth New Password', () => {
    beforeEach(async () => {
        console.log('reset')
        await testingRequests.resetAll();
    });
    afterAll(async () => {
        await testingRequests.resetAll();
    });
    it('Should be return 204 and change password for user', async () => {
        const createUser = await userRequests.createUser(BASIC_VALID_HEADER, userInSystem);
        expect(createUser.status).toBe(StatusCode.CREATED_201);

        const recovery = await authRequests.passwordRecovery(userInSystem.email)
        expect(recovery.status).toBe(StatusCode.NO_CONTENT_204);

        const userResultBefore = await userDbAdapter.getUserByLoginOrEmail(userInSystem.email);
        expect(userResultBefore!.recoveryPasswordConfirm.isConfirmed).toBeFalsy();
        const newPassword = {
            "newPassword": "newPassword123456",
            "recoveryCode": userResultBefore!.recoveryPasswordConfirm!.recoveryCode,
        }
        const newPasswordResult = await authRequests.newPassword(newPassword);
        expect(newPasswordResult.status).toBe(StatusCode.NO_CONTENT_204);

        const userResultAfter = await userDbAdapter.getUserByLoginOrEmail(userInSystem.email);
        expect(userResultAfter!.recoveryPasswordConfirm.isConfirmed).toBeTruthy();

    })

    it('Should be return 400 if password min 6 and max 20 length symbols', async () => {
        const createUser = await userRequests.createUser(BASIC_VALID_HEADER, userInSystem);
        expect(createUser.status).toBe(StatusCode.CREATED_201);

        const recovery = await authRequests.passwordRecovery(createUser.body.email)
        expect(recovery.status).toBe(StatusCode.NO_CONTENT_204);

        const userResult = await userDbAdapter.getUserByLoginOrEmail(createUser.body.email);

        const newPassErrorMin = await authRequests.newPassword({
            "newPassword": generateRandomStringForTest(21),
            "recoveryCode": userResult!.recoveryPasswordConfirm!.recoveryCode,
        });
        expect(newPassErrorMin.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(newPassErrorMin.body).toEqual({errorsMessages: [{field: "newPassword", message: expect.any(String)}]});

        const newPassErrorMax = await authRequests.newPassword({
            "newPassword": generateRandomStringForTest(4),
            "recoveryCode": userResult!.recoveryPasswordConfirm!.recoveryCode,
        });
        expect(newPassErrorMax.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(newPassErrorMax.body).toEqual({errorsMessages: [{field: "newPassword", message: expect.any(String)}]});

        const userResultAfter = await userDbAdapter.getUserByLoginOrEmail(userInSystem.email);
        expect(userResultAfter!.recoveryPasswordConfirm.isConfirmed).toBeFalsy();
    })
    it('Should be return 400 if', async () => {

    });
    it('Should be return 429 if 5 attempts from one IP-address during 10 seconds', async () => {
        const createUser = await userRequests.createUser(BASIC_VALID_HEADER, userInSystem);
        expect(createUser.status).toBe(StatusCode.CREATED_201);
        const recovery = await authRequests.passwordRecovery(createUser.body.email);
        expect(recovery.status).toBe(StatusCode.NO_CONTENT_204);
        const userDb = await userDbAdapter.getUserByLoginOrEmail(userInSystem.email);
        const newPassword = {
            recoveryCode: userDb!.recoveryPasswordConfirm!.recoveryCode,
            "newPassword": generateRandomStringForTest(21),
        }
        for (let i = 0; i < 5; i++) {
            await authRequests.newPassword(newPassword); // Или другой эндпоинт
        }
        // Делаем еще один запрос, чтобы превысить лимит
        const res = await authRequests.newPassword(newPassword);

        // Проверяем, что статус 429 (слишком много запросов)
        expect(res.status).toBe(StatusCode.MANY_REQUEST_429);
    })
})