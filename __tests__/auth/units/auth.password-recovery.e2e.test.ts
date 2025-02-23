import {testingRequests} from "../../testing/testingRequests";
import {userRequests} from "../../users/userRequests";
import {getAuthHeaderBasicTest} from "../../helpers/testUtils";
import {SETTINGS} from "../../../src/settings";
import {StatusCode} from "../../../src/types/status-code-types";
import {authRequests} from "../authRequests";

const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const userInSystem = {
    email: "test@test.com",
    login: "test",
    password: "test123456",
}


describe('Auth Password Recovery', () => {
    beforeEach(async () => {
        await testingRequests.resetAll();
    });
    afterAll(async () => {
        await testingRequests.resetAll();
    });
    it('Should be return 204', async () => {
        const createUser = await userRequests.createUser(BASIC_VALID_HEADER, userInSystem);
        expect(createUser.status).toBe(StatusCode.CREATED_201);
        const recovery = await authRequests.passwordRecovery(createUser.body.email)

        expect(recovery.status).toBe(StatusCode.NO_CONTENT_204);
    })

    it('Should be return 400 if email invalid', async () => {
        const recovery = await authRequests.passwordRecovery(
            '222^gmail.com',
        );
        expect(recovery.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(recovery.body).toEqual({errorsMessages: [
                {field: "email", message: expect.any(String)}
            ]});
    })

    it('Should be return 429 if 5 attempts from one IP-address during 10 seconds', async () => {

        for (let i = 0; i < 5; i++) {
            await authRequests.passwordRecovery(userInSystem.email); // Или другой эндпоинт
        }
        // Делаем еще один запрос, чтобы превысить лимит
        const res = await authRequests.passwordRecovery(userInSystem.email);

        // Проверяем, что статус 429 (слишком много запросов)
        expect(res.status).toBe(StatusCode.MANY_REQUEST_429);
    })
})