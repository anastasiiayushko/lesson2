import {generateRandomStringForTest, getAuthHeaderBasicTest} from "../../helpers/testUtils";
import {userRequests} from "../../users/userRequests";
import {SETTINGS} from "../../../src/settings";
import {blogDataTest} from "../../../src/features/test/blogData";
import {testingRequests} from "../../testing/testingRequests";
import {ObjectId, WithId} from "mongodb";
import {PostSchemaType} from "../../../src/db/types/db-post-type";
import {authRequests} from "../../auth/authRequests";
import {commentRequests} from "../commentRequests";
import DataBaseMongoose from "../../../src/db/DataBaseMongoose";

const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)

const userNika = {
    login: "nika",
    password: "nika123456",
    email: "nika@gmail.com",
}
const BLOG_DATA_WITH_ID = blogDataTest;

const postEntry: WithId<PostSchemaType>[] = [
    {
        _id: new ObjectId(),
        title: "post 1",
        shortDescription: "desc post 1",
        content: "content post 1",
        blogId: BLOG_DATA_WITH_ID[0]._id.toString(),
        blogName: BLOG_DATA_WITH_ID[0].name,
        createdAt: new Date().toISOString()
    },
    {
        _id: new ObjectId(),
        title: "post 2",
        shortDescription: "desc post 2",
        content: "content post 2",
        blogId: BLOG_DATA_WITH_ID[1]._id.toString(),
        blogName: BLOG_DATA_WITH_ID[1].name,
        createdAt: new Date().toISOString()
    }
]
const dbMongoose = new DataBaseMongoose();
beforeAll(async () => {
    console.log('starting dbMongoose');
    await dbMongoose.connect(SETTINGS.MONGO_URL, SETTINGS.DATABASE_NAME)
})
afterAll(async () => {
    console.log('closed dbMongoose');
    await dbMongoose.disconnect()
})
describe('Comments paging', () => {
    beforeAll(async () => {
        await testingRequests.resetAll();
        await userRequests.createUser(BASIC_VALID_HEADER, userNika);
        await testingRequests.insertBlogsAndReturn([...BLOG_DATA_WITH_ID]);
        await testingRequests.insertPostsAndReturn([...postEntry]);

        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password);
        let token = nikaLoginResult.body.accessToken;
        let commentBody = generateRandomStringForTest(50);
        for (const post of postEntry) {
            const promises = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(() =>
                commentRequests.createCommentByPostIdParams(token, post._id.toString(), commentBody)
            );
            await Promise.all(promises);
        }

    })

    it("Should return 200 and resource", async () => {
        let totalCounts = 11;
        let pageSize = 6;
        let pageCount = Math.ceil(totalCounts / pageSize);
        let lastPageItemsCount = totalCounts % pageSize || pageSize;
        let noExistingPage = pageCount + 1;
        let postFirst = postEntry[0]
        let resWithPaging = await commentRequests.getCommentsByPostWithPaging(postFirst._id.toString(), {pageSize: pageSize});

        expect(resWithPaging.body.items.length).toBe(6);
        expect(resWithPaging.body.page).toBe(1);
        expect(resWithPaging.body.pageSize).toBe(pageSize);
        expect(resWithPaging.body.totalCount).toBe(totalCounts);
        expect(resWithPaging.body.pagesCount).toBe(pageCount);

        let resWithPagingPage2 = await commentRequests.getCommentsByPostWithPaging(postFirst._id.toString(), {
            pageSize: pageSize,
            pageNumber: 2
        });
        expect(resWithPagingPage2.body.page).toBe(2);
        expect(resWithPagingPage2.body.items.length).toBe(lastPageItemsCount);
        //
        let resWithPagingPageNoExisting = await commentRequests.getCommentsByPostWithPaging(postFirst._id.toString(), {
            pageSize: pageSize,
            pageNumber: noExistingPage
        });
        //
        expect(resWithPagingPageNoExisting.body.page).toBe(noExistingPage);
        expect(resWithPagingPageNoExisting.body.pageSize).toBe(pageSize);
        expect(resWithPagingPageNoExisting.body.totalCount).toBe(totalCounts);
        expect(resWithPagingPageNoExisting.body.pagesCount).toBe(pageCount);
        expect(resWithPagingPageNoExisting.body.items.length).toBe(0);
    })
});