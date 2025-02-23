import {testingRequests} from "../../testing/testingRequests";
import {authRequests} from "../authRequests";
import {StatusCode} from "../../../src/types/status-code-types";
import {userDbAdapter} from "../../users/userDbAdapter";
import {SETTINGS} from "../../../src/settings";
import {randomUUID} from "crypto";
import {ApiErrorResultType} from "../../../src/types/output-error-types";

let userNika = {
    login: 'nika',
    email: 'test@gmail.com',
    password: 'nika123'
}

describe("Auth registration email confirmation", () => {
    beforeEach(async () => {
        await testingRequests.resetAll();
        SETTINGS.AUTH_EXPIRATION_DATE_MIN = 5;
        SETTINGS.AUTH_EXPIRATION_DATE_HOURS = 0;
    });
    afterAll(async () => {
        await testingRequests.resetAll();
    });
    it("Should be return 204 and Email was verified. Account was activated", async () => {
        let authRes = await authRequests.authRegistration(userNika);
        expect(authRes.status).toBe(StatusCode.NO_CONTENT_204);

        let userByEmail = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(userByEmail).not.toBeNull();
        expect(userByEmail!.emailConfirmation!.isConfirmed).toBeFalsy()

        let confirmedRes = await authRequests.authEmailConfirmed(userByEmail!.emailConfirmation.confirmationCode)
        expect(confirmedRes.status).toBe(StatusCode.NO_CONTENT_204);

        let user = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(user!.emailConfirmation!.isConfirmed).toBeTruthy()


    })

    it("Should be return 400 if expiration date has expired ", async () => {
        SETTINGS.AUTH_EXPIRATION_DATE_MIN = -2;
        let authRes = await authRequests.authRegistration(userNika);
        expect(authRes.status).toBe(StatusCode.NO_CONTENT_204);

        let userByEmail = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(userByEmail).not.toBeNull();
        expect(userByEmail!.emailConfirmation!.isConfirmed).toBeFalsy()

        let confirmedRes = await authRequests.authEmailConfirmed(userByEmail!.emailConfirmation.confirmationCode)
        expect(confirmedRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(confirmedRes.body).toEqual<ApiErrorResultType>({
            errorsMessages: [{field: "code", message: expect.any(String)}]
        })

        let user = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(user!.emailConfirmation!.isConfirmed).toBeFalsy()

    })

    it("Should be return 400 if the code no existing", async () => {
        let authRes = await authRequests.authRegistration(userNika);
        expect(authRes.status).toBe(StatusCode.NO_CONTENT_204);

        let userByEmail = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(userByEmail).not.toBeNull();
        expect(userByEmail!.emailConfirmation!.isConfirmed).toBeFalsy()

        let confirmedRes = await authRequests.authEmailConfirmed(randomUUID())
        expect(confirmedRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(confirmedRes.body).toEqual<ApiErrorResultType>({
            errorsMessages: [{field: "code", message: expect.any(String)}]
        })
        let user = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(user!.emailConfirmation!.isConfirmed).toBeFalsy()

    })

    it("Should return 400 if the email address has been confirmed and wants to be confirmed again", async () => {
        let authRes = await authRequests.authRegistration(userNika);
        expect(authRes.status).toBe(StatusCode.NO_CONTENT_204);

        let userByEmail = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(userByEmail).not.toBeNull();
        expect(userByEmail!.emailConfirmation!.isConfirmed).toBeFalsy()

        let confirmedRes = await authRequests.authEmailConfirmed(userByEmail!.emailConfirmation!.confirmationCode)
        expect(confirmedRes.status).toBe(StatusCode.NO_CONTENT_204);

        let user = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(user!.emailConfirmation!.isConfirmed).toBeTruthy()

        let confirmedAgainRes = await authRequests.authEmailConfirmed(userByEmail!.emailConfirmation!.confirmationCode)
        expect(confirmedAgainRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(confirmedAgainRes.body).toEqual<ApiErrorResultType>({
            errorsMessages: [{field: "code", message: expect.any(String)}]
        })
    });
    it('Should return 429 if more than 5 requests in 10 seconds', async () => {

        for (let i = 0; i < 5; i++) {
            await authRequests.authEmailConfirmed("test"); // Или другой эндпоинт
        }

        // Делаем еще один запрос, чтобы превысить лимит
        const res = await authRequests.authEmailConfirmed("test123456");

        // Проверяем, что статус 429 (слишком много запросов)
        expect(res.status).toBe(StatusCode.MANY_REQUEST_429);
    });

})