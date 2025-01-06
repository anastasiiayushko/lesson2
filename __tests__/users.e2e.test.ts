import {getAuthHeaderBasicTest, resetTestData} from "./helpers/testUtils";
import request from "supertest";
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {StatusCode} from "../src/types/status-code-types";
import {UserSecureViewModel} from "../src/types/input-output-types/user-types";
import {ApiErrorResultType} from "../src/types/output-error-types";
import {ObjectId} from "mongodb";
import {fetchUsersWithPagingTest} from "./helpers/usersUtils";

const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const BASIC_INVALID_HEADER = getAuthHeaderBasicTest('test:test')


describe('User CREATE PROTECTED', () => {
    beforeEach(async () => {
        await resetTestData(app)
    });
    it('Should return 401 invalid auth data', async () => {
        let user = {
            email: "test@test.com",
            login: "test",
            password: "test123456",
        }
        let response = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': BASIC_INVALID_HEADER})
            .send(user);
        expect(response.status).toBe(StatusCode.UNAUTHORIZED_401);

    });

    it('Should return the created user', async () => {
        let user = {
            email: "test@test.com",
            login: "test",
            password: "test123456",
        }
        let response = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': BASIC_VALID_HEADER})
            .send(user);
        expect(response.status).toBe(StatusCode.CREATED_201);

        expect(response.body).toMatchObject<UserSecureViewModel>({
            id: expect.any(String),
            login: user.login,
            email: user.email,
            createdAt: expect.any(String),
        })
    })
    it('Should return an error that the email field is already in the system', async () => {
        let user = {
            email: "test@test.com",
            login: "test",
            password: "test123456",
        }
        let response = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': BASIC_VALID_HEADER})
            .send(user);
        expect(response.status).toBe(StatusCode.CREATED_201);


        let userSecond = {
            email: "test@test.com",
            login: "test2",
            password: "test123456",
        }
        let responseFatal = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': BASIC_VALID_HEADER})
            .send(userSecond)

        expect(responseFatal.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(responseFatal.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: "email", message: expect.any(String)}
            ]
        })

    })
    it('Should return an error that the login field is already in the system', async () => {
        let user = {
            email: "test@test.com",
            login: "test",
            password: "test123456",
        }
        let response = await request(app)
            .post(SETTINGS.PATH.USERS)
            .send(user)
            .set({'Authorization': BASIC_VALID_HEADER})
        expect(response.status).toBe(StatusCode.CREATED_201);


        let userSecond = {
            email: "test2@test.com",
            login: "test",
            password: "test123456",
        }
        let responseFatal = await request(app)
            .post(SETTINGS.PATH.USERS)
            .send(userSecond)
            .set({'Authorization': BASIC_VALID_HEADER})
        expect(responseFatal.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(responseFatal.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: "login", message: expect.any(String)}
            ]
        })

    })

})


describe('User DELETE PROTECTED', () => {
    let userDb = null
    beforeAll(async () => {
        await resetTestData(app);
        let res = await request(app).post(SETTINGS.PATH.USERS)
            .send({
                email: "delete@test.com",
                login: "delete",
                password: "test123456",
            })
            .set({'Authorization': BASIC_VALID_HEADER}).expect(StatusCode.CREATED_201)
        userDb = res.body;
    })
    it('Should return 401 invalid auth data', async () => {

        let existingId = new ObjectId();

        await request(app).delete(SETTINGS.PATH.USERS + "/" + existingId.toString())
            .set({'Authorization': BASIC_INVALID_HEADER})
            .expect(StatusCode.UNAUTHORIZED_401);
        let resUsersWithPaging = await request(app).get(SETTINGS.PATH.USERS).set({'Authorization': BASIC_VALID_HEADER});
        expect(resUsersWithPaging.body.items.length).toBe(1);
    })

    it('Should be return error if user by id not found', async () => {

        let noExistingId = new ObjectId();

        await request(app).delete(SETTINGS.PATH.USERS + "/" + noExistingId.toString()).set({'Authorization': BASIC_VALID_HEADER})
            .expect(StatusCode.NOT_FOUND__404);

        let resUsersWithPaging = await request(app).get(SETTINGS.PATH.USERS).set({'Authorization': BASIC_VALID_HEADER});
        expect(resUsersWithPaging.body.items.length).toBe(1);
    })
    it('Should be deleted existing user by id', async () => {


        await request(app).delete(SETTINGS.PATH.USERS + "/" + userDb!.id).set({'Authorization': BASIC_VALID_HEADER})
            .expect(StatusCode.NO_CONTENT_204)

        let resUsersWithPaging = await request(app).get(SETTINGS.PATH.USERS).set({'Authorization': BASIC_VALID_HEADER});
        expect(resUsersWithPaging.body.items.length).toBe(0);
    })

})


describe('Users WITH PAGING PROTECTED', () => {
    const usersDb = [
        {
            _id: new ObjectId(),
            login: "user1",
            email: "user1@example.com",
            password: "password123",
            createdAt: new Date().toISOString()
        },
        {
            _id: new ObjectId(),
            login: "user2",
            email: "user2@example.com",
            password: "securepass456",
            createdAt: new Date().toISOString()
        },
        {
            _id: new ObjectId(),
            login: "user3",
            email: "user3@example.com",
            password: "mypassword789",
            createdAt: new Date().toISOString()
        },
        {
            _id: new ObjectId(),
            login: "user4",
            email: "user4@example.com",
            password: "anotherpass321",
            createdAt: new Date().toISOString()
        },
        {
            _id: new ObjectId(),
            login: "user5",
            email: "user5@example.com",
            password: "yetanotherpass654",
            createdAt: new Date().toISOString()
        },
    ];
    beforeAll(async () => {
        await resetTestData(app);
        await request(app).post(SETTINGS.PATH.TESTING + "/users/insert")
            .send(usersDb)
            .set({'Authorization': BASIC_VALID_HEADER})
            .expect(StatusCode.NO_CONTENT_204);


    })
    it('Should be return list users and paging data', async () => {
        let res = await fetchUsersWithPagingTest(app, BASIC_INVALID_HEADER);
        expect(res.status).toBe(StatusCode.UNAUTHORIZED_401);
    })

    it('Should be return correct data page with paging', async () => {
        let totalCounts = usersDb.length;
        let pageSize = 3;
        let pageCount = Math.ceil(totalCounts / pageSize);
        let lastPageItemsCount = totalCounts % pageSize || pageSize;
        let noExistingPage = pageCount + 1;
        let resWithPaging = await fetchUsersWithPagingTest(app, BASIC_VALID_HEADER, {pageSize: pageSize});

        let expectedUserItems = usersDb.slice(0, pageSize)
            .map(item => {
                let {_id, password, ...reset} = item;
                return {
                    id: _id.toString(),
                    ...reset
                }
            })
        expect(resWithPaging.body.items).toEqual(expectedUserItems);
        expect(resWithPaging.body.page).toBe(1);
        expect(resWithPaging.body.pageSize).toBe(pageSize);
        expect(resWithPaging.body.totalCount).toBe(totalCounts);
        expect(resWithPaging.body.pagesCount).toBe(pageCount);

        let resWithPagingPage2 = await fetchUsersWithPagingTest(app, BASIC_VALID_HEADER, {
            pageSize: pageSize,
            pageNumber: 2
        });

        expect(resWithPagingPage2.body.page).toBe(2);
        expect(resWithPagingPage2.body.items.length).toBe(lastPageItemsCount);

        let resWithPagingPageNoExisting = await fetchUsersWithPagingTest(app, BASIC_VALID_HEADER, {
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