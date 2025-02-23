import {testingRequests} from "../../testing/testingRequests";
import {SETTINGS} from "../../../src/settings";
import {StatusCode} from "../../../src/types/status-code-types";
import {userRequests} from "../userRequests";
import {generateRandomStringForTest, getAuthHeaderBasicTest} from "../../helpers/testUtils";
import {UserSecureViewModel} from "../../../src/types/input-output-types/user-types";
import {userDbAdapter} from "../userDbAdapter";
import request from "supertest";
import {app} from "../../../src/app";
import {ApiErrorResultType} from "../../../src/types/output-error-types";


const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const BASIC_INVALID_HEADER = getAuthHeaderBasicTest('test:test')

const userTest = {
    email: "test@test.com",
    login: "test",
    password: "test123456",
}
describe("User admin create", () => {
    beforeEach(async () => {
        await testingRequests.resetAll();
    });
    afterAll(async () => {
        await testingRequests.resetAll();
    });
    it('Should return 401 if invalid header basic auth', async () => {
        let response = await userRequests.createUser(BASIC_INVALID_HEADER, userTest);
        expect(response.status).toBe(StatusCode.UNAUTHORIZED_401);
    });

    it('Should be return 201 if valid header basic auth and correct data. Default Account verified', async () => {
        let response = await userRequests.createUser(BASIC_VALID_HEADER, userTest);
        expect(response.status).toBe(StatusCode.CREATED_201);
        expect(response.body).toMatchObject<UserSecureViewModel>({
            id: expect.any(String),
            login: userTest.login,
            email: userTest.email,
            createdAt: expect.any(String),
        });

        let userByIdRes = await userDbAdapter.getUserByLoginOrEmail(userTest.email);
        expect(userByIdRes!.emailConfirmation.isConfirmed).toBeTruthy()
    });

    it('Should return 400 error that the email field is already in the system', async () => {
        let userTestRes = await userRequests.createUser(BASIC_VALID_HEADER, userTest);
        expect(userTestRes.status).toBe(StatusCode.CREATED_201);

        let userTestCopyRes = await userRequests.createUser(BASIC_VALID_HEADER, {
            email: userTest.email,
            login: generateRandomStringForTest(8),
            password: 'user123456'
        });
        expect(userTestCopyRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(userTestCopyRes.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: "email", message: expect.any(String)}
            ]
        })

    });

    it('Should return 400 error that the login field is already in the system', async () => {
        let userTestRes = await userRequests.createUser(BASIC_VALID_HEADER, userTest);
        expect(userTestRes.status).toBe(StatusCode.CREATED_201);

        let userTestCopyRes = await userRequests.createUser(BASIC_VALID_HEADER, {
            login: userTest.login,
            email: "supperuser@gmail.com",
            password: 'user123456'
        });
        expect(userTestCopyRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(userTestCopyRes.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: "login", message: expect.any(String)}
            ]
        })
    })

})