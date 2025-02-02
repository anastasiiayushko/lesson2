import {testingRequests} from "../../testing/testingRequests";
import {authRequests} from "../authRequests";
import {StatusCode} from "../../../src/types/status-code-types";
import {userDbAdapter} from "../../users/userDbAdapter";
import {SETTINGS} from "../../../src/settings";
import {ApiErrorResultType} from "../../../src/types/output-error-types";

let userNika = {
    login: 'nika',
    email: 'test@gmail.com',
    password: 'nika123'
}

describe("Auth registration email resending", () => {
    beforeEach(async () => {
        await testingRequests.resetAll();
        SETTINGS.AUTH_EXPIRATION_DATE_MIN = 5;
        SETTINGS.AUTH_EXPIRATION_DATE_HOURS = 0;
    });
    it("Should be return 204 and email resending.", async () => {
        let authRes = await authRequests.authRegistration(userNika);
        expect(authRes.status).toBe(StatusCode.NO_CONTENT_204);

        let user = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(user!.emailConfirmation!.isConfirmed).toBeFalsy()

        let resendingRes = await authRequests.authEmailResending(userNika.email)
        expect(resendingRes.status).toBe(StatusCode.NO_CONTENT_204);

        let userNewConfirmedCode = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(userNewConfirmedCode!.emailConfirmation!.isConfirmed).toBeFalsy();

        let oldExpirationDate = new Date(user!.emailConfirmation.expirationDate);
        let newExpirationDate = new Date(userNewConfirmedCode!.emailConfirmation.expirationDate);

        expect(oldExpirationDate.getTime()).toBeLessThan(newExpirationDate.getTime());
    });

    it("Should be return 400 if account was activated", async () => {
        let authRes = await authRequests.authRegistration(userNika);
        expect(authRes.status).toBe(StatusCode.NO_CONTENT_204);

        let userByEmail = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(userByEmail).not.toBeNull();
        expect(userByEmail!.emailConfirmation!.isConfirmed).toBeFalsy()


        let confirmedRes = await authRequests.authEmailConfirmed(userByEmail!.emailConfirmation.confirmationCode)
        expect(confirmedRes.status).toBe(StatusCode.NO_CONTENT_204);

        let user = await userDbAdapter.getUserByLoginOrEmail(userNika.email);
        expect(user!.emailConfirmation!.isConfirmed).toBeTruthy();

        let resendingRes = await authRequests.authEmailResending(userNika.email)
        expect(resendingRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(resendingRes.body).toEqual<ApiErrorResultType>({
            errorsMessages: [
                {field: "email", message: expect.any(String)}
            ]
        });

    })

    it("Should be return 400 if email not existing", async () => {


        let resendingRes = await authRequests.authEmailResending(userNika.email)
        expect(resendingRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(resendingRes.body).toEqual<ApiErrorResultType>({
            errorsMessages: [
                {field: "email", message: expect.any(String)}
            ]
        });

    })

})