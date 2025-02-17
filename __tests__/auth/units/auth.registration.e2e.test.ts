import {testingRequests} from "../../testing/testingRequests";
import {authRequests} from "../authRequests";
import {StatusCode} from "../../../src/types/status-code-types";
import {userDbAdapter} from "../../users/userDbAdapter";
import {EmailConfirmationViewType} from "../../../src/types/input-output-types/user-types";
import {ApiErrorResultType} from "../../../src/types/output-error-types";

let userNika = {
    login: 'nika',
    email: 'test@gmail.com',
    password: 'nika123'
}

describe("Auth registration", () => {
    beforeEach(async () => {
        await testingRequests.resetAll();
    });

    it("Should be return 204 create user and send email", async () => {
        let authRes = await authRequests.authRegistration(userNika);
        expect(authRes.status).toBe(StatusCode.NO_CONTENT_204);

        let userByEmail = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(userByEmail).not.toBeNull();
        expect(userByEmail!.emailConfirmation!.isConfirmed).toEqual(false)
        expect(userByEmail!.emailConfirmation).toEqual<EmailConfirmationViewType>({
            confirmationCode: expect.any(String),
            expirationDate: expect.any(Date),
            isConfirmed: false
        })
    })
    it("Should be return 400  if the user with the given email or login already exists ", async () => {
        let authRes = await authRequests.authRegistration(userNika);
        expect(authRes.status).toBe(StatusCode.NO_CONTENT_204);
        let userSecond = {
            email: userNika.email,
            login: 'userlogin',
            password: 'user1234'
        }
        let authResDub= await authRequests.authRegistration(userSecond);
        expect(authResDub.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(authResDub.body).toEqual<ApiErrorResultType>({
            errorsMessages:[
                {field: "email", message: expect.any(String)}
            ]
        })

    })
    it("Should be return 400  if the email or login no exists ", async () => {
        let user = {
            email: 'user2@gmail.com',
            login: '',
            password: 'user1234'
        }
        let authRes= await authRequests.authRegistration(user);
        expect(authRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(authRes.body).toEqual<ApiErrorResultType>({
            errorsMessages:[
                {field: "login", message: expect.any(String)}
            ]
        })

    });

    it('Should return 429 if more than 5 requests in 10 seconds', async () => {

        for (let i = 0; i < 5; i++) {
            await authRequests.authRegistration(userNika); // Или другой эндпоинт
        }

        // Делаем еще один запрос, чтобы превысить лимит
        const res = await authRequests.authRegistration(userNika);

        // Проверяем, что статус 429 (слишком много запросов)
        expect(res.status).toBe(StatusCode.MANY_REQUEST_429);
    });

})