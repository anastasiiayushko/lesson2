import {testingRequests} from "../../testing/testingRequests";
import {SETTINGS} from "../../../src/settings";
import {StatusCode} from "../../../src/types/status-code-types";
import {userRequests} from "../userRequests";
import {getAuthHeaderBasicTest} from "../../helpers/testUtils";
import {userDbAdapter} from "../userDbAdapter";
import {ObjectId} from "mongodb";


const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const BASIC_INVALID_HEADER = getAuthHeaderBasicTest('test:test')

const userTest = {
    email: "test@test.com",
    login: "test",
    password: "test123456",
}
describe("User admin delete", () => {
    let userDb = null;
    beforeEach(async () => {
        await testingRequests.resetAll();
        let userRes = await userRequests.createUser(BASIC_VALID_HEADER, userTest);
        userDb = userRes.body

    });
    afterAll(async () => {
        await testingRequests.resetAll();
    });
    it('Should return 401 if invalid header basic auth', async () => {
        let response = await userRequests.deleteUser(BASIC_INVALID_HEADER, userDb!.id);
        expect(response.status).toBe(StatusCode.UNAUTHORIZED_401);

        let userRes = await userDbAdapter.getUserByLoginOrEmail(userDb!.email);
        expect(userRes).not.toBeNull();
    });

    it('Should be return 404 error if user by id not found', async () => {
        let noExistingId = new ObjectId();
        let response = await userRequests.deleteUser(BASIC_VALID_HEADER, noExistingId.toString());
        expect(response.status).toBe(StatusCode.NOT_FOUND__404);
    });
    it('Should be 204 deleted existing user by id', async () => {
        let response = await userRequests.deleteUser(BASIC_VALID_HEADER, userDb!.id);
        expect(response.status).toBe(StatusCode.NO_CONTENT_204);
        let userRes = await userDbAdapter.getUserByLoginOrEmail(userDb!.email);
        expect(userRes).toBeNull();
    });

})