import {testingRequests} from "../../testing/testingRequests";
import {SETTINGS} from "../../../src/settings";
import {StatusCode} from "../../../src/types/status-code-types";
import {userRequests} from "../userRequests";
import {getAuthHeaderBasicTest} from "../../helpers/testUtils";
import {ObjectId} from "mongodb";
import {UserSchemaType} from "../../../src/db/types/db-user-type";
import {randomUUID} from "crypto";


const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const BASIC_INVALID_HEADER = getAuthHeaderBasicTest('test:test')

const usersDb: UserSchemaType[] = [
    {
        _id: new ObjectId(),
        login: "user1",
        email: "user1@example.com",
        password: "password123",
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            isConfirmed: true, confirmationCode: randomUUID(), expirationDate: new Date()
        }
    },
    {
        _id: new ObjectId(),
        login: "user2",
        email: "user2@example.com",
        password: "securepass456",
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            isConfirmed: true,
            confirmationCode: randomUUID(),
            expirationDate: new Date()
        }
    },
    {
        _id: new ObjectId(),
        login: "user3",
        email: "user3@example.com",
        password: "mypassword789",
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            isConfirmed: true, confirmationCode: randomUUID(), expirationDate: new Date()
        }
    },
    {
        _id: new ObjectId(),
        login: "user4",
        email: "user4@example.com",
        password: "anotherpass321",
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            isConfirmed: true, confirmationCode: randomUUID(), expirationDate: new Date()
        }
    },
    {
        _id: new ObjectId(),
        login: "user5",
        email: "user5@example.com",
        password: "yetanotherpass654",
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            isConfirmed: true, confirmationCode: randomUUID(), expirationDate: new Date()
        }
    },
];
describe("User admin paging", () => {
    beforeEach(async () => {
        await testingRequests.resetAll();
        await testingRequests.insertUsersAndReturn(usersDb);

    });

    it('Should be return list users and paging data', async () => {
        let res = await userRequests.usersPaging(BASIC_INVALID_HEADER, {});
        expect(res.status).toBe(StatusCode.UNAUTHORIZED_401);
    })

    it('Should be return correct data page with paging', async () => {
        let totalCounts = usersDb.length;
        let pageSize = 3;
        let pageCount = Math.ceil(totalCounts / pageSize);
        let lastPageItemsCount = totalCounts % pageSize || pageSize;
        let noExistingPage = pageCount + 1;
        let resWithPaging = await userRequests.usersPaging(BASIC_VALID_HEADER, {pageSize: pageSize});

        let expectedUserItems = usersDb.slice(0, pageSize)
            .map(item => {
                let {_id, password, emailConfirmation, ...users} =item;
                return {id: _id.toString(), ...users}
            })
        expect(resWithPaging.body.items).toEqual(expectedUserItems);
        expect(resWithPaging.body.page).toBe(1);
        expect(resWithPaging.body.pageSize).toBe(pageSize);
        expect(resWithPaging.body.totalCount).toBe(totalCounts);
        expect(resWithPaging.body.pagesCount).toBe(pageCount);

        let resWithPagingPage2 = await userRequests.usersPaging(BASIC_VALID_HEADER, {
            pageSize: pageSize,
            pageNumber: 2
        });

        expect(resWithPagingPage2.body.page).toBe(2);
        expect(resWithPagingPage2.body.items.length).toBe(lastPageItemsCount);

        let resWithPagingPageNoExisting = await userRequests.usersPaging(BASIC_VALID_HEADER, {
            pageSize: pageSize,
            pageNumber: noExistingPage
        });

        expect(resWithPagingPageNoExisting.body.page).toBe(noExistingPage);
        expect(resWithPagingPageNoExisting.body.pageSize).toBe(pageSize);
        expect(resWithPagingPageNoExisting.body.totalCount).toBe(totalCounts);
        expect(resWithPagingPageNoExisting.body.pagesCount).toBe(pageCount);
        expect(resWithPagingPageNoExisting.body.items.length).toBe(0);

    })


})