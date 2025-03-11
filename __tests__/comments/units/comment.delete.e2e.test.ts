import {generateRandomStringForTest, getAuthHeaderBasicTest} from "../../helpers/testUtils";
import {userRequests} from "../../users/userRequests";
import {SETTINGS} from "../../../src/settings";
import {blogDataTest} from "../../../src/features/test/blogData";
import {testingRequests} from "../../testing/testingRequests";
import {ObjectId, WithId} from "mongodb";
import {PostSchemaType} from "../../../src/db/types/db-post-type";
import {authRequests} from "../../auth/authRequests";
import {commentRequests} from "../commentRequests";
import {StatusCode} from "../../../src/types/status-code-types";
import {CommentViewModelType} from "../../../src/features/comment/core/type/input-outup-commets";
import {jwtService} from "../../../src/app/jwtService";
import {throttlingRateCollection} from "../../../src/db/db";
import DataBaseMongoose from "../../../src/db/DataBaseMongoose";

const BASIC_VALID_HEADER = getAuthHeaderBasicTest(SETTINGS.ADMIN)
const userIgor = {
    login: "igor",
    password: "igor123456",
    email: "igor@gmail.com",
}
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
    },
    {
        _id: new ObjectId(),
        title: "post 3",
        shortDescription: "desc post 3",
        content: "content post 3",
        blogId: BLOG_DATA_WITH_ID[0]._id.toString(),
        blogName: BLOG_DATA_WITH_ID[0].name,
        createdAt: new Date().toISOString()
    },
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
describe('Comment delete', () => {
    beforeAll(async () => {
        await testingRequests.resetAll();
        await userRequests.createUser(BASIC_VALID_HEADER, userNika);
        await userRequests.createUser(BASIC_VALID_HEADER, userIgor);
        await testingRequests.insertBlogsAndReturn([...BLOG_DATA_WITH_ID]);
        await testingRequests.insertPostsAndReturn([...postEntry]);
    })
    beforeEach(async () => {
        await throttlingRateCollection.drop();
    })
    it("Should return 403 If try delete the comment that is not your own ", async () => {
        let nikaLoginResultOwner = await authRequests.login(userNika.login, userNika.password)
        let tokenOwner = nikaLoginResultOwner.body.accessToken;
        expect(tokenOwner).toEqual(expect.any(String))

        let commentTargetPost = postEntry[0];
        let commentBody = generateRandomStringForTest(50);
        let commentCreateRes = await commentRequests.createCommentByPostIdParams(tokenOwner, commentTargetPost._id.toString(), commentBody);
        let comment = commentCreateRes.body;
        expect(commentCreateRes.status).toBe(StatusCode.CREATED_201);
        /* edit comment gust */
        let igorLoginResult = await authRequests.login(userIgor.login, userIgor.password);
        let tokenGust = igorLoginResult.body.accessToken;
        let deleteRes = await commentRequests.deleteComment(tokenGust, comment.id);
        expect(deleteRes.status).toBe(StatusCode.FORBIDDEN_403);
        /* **/
        let commentByIdRes = await commentRequests.getCommentById(commentCreateRes.body.id);
        expect(commentByIdRes.body).toMatchObject<CommentViewModelType>(comment);
    })

    it("Should return 401 if user Unauthorized", async () => {
        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password);
        let tokenOwner = nikaLoginResult.body.accessToken;
        let commentBody = generateRandomStringForTest(50)

        let commentTargetPost = postEntry[0];
        let commentCreateRes = await commentRequests.createCommentByPostIdParams(tokenOwner, commentTargetPost._id.toString(), commentBody);
        let comment = commentCreateRes.body;
        let tokenGust = await jwtService.createAccessToken(new ObjectId().toString())

        let commentRes = await commentRequests.deleteComment('', comment.id);
        expect(commentRes.status).toBe(StatusCode.UNAUTHORIZED_401);
    })



    it("Should return 404 if commentId no existing", async () => {
        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password)
        let token = nikaLoginResult.body.accessToken;

        let commentTargetPost = postEntry[0];
        let commentBody = generateRandomStringForTest(30);
        let commentRes = await commentRequests.createCommentByPostIdParams(token, commentTargetPost._id.toString(), commentBody);
        expect(commentRes.status).toBe(StatusCode.CREATED_201);

        let commentId = new ObjectId().toString()
        let commentPutRes = await commentRequests.deleteComment(token, commentId)
        expect(commentPutRes.status).toBe(StatusCode.NOT_FOUND__404);
    })

    it("Should return 204 success delete comment", async () => {
        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password)
        let token = nikaLoginResult.body.accessToken;

        let commentTargetPost = postEntry[0];
        let commentBody = generateRandomStringForTest(30);
        let commentRes = await commentRequests.createCommentByPostIdParams(token, commentTargetPost._id.toString(), commentBody);
        expect(commentRes.status).toBe(StatusCode.CREATED_201);

        let commentId = commentRes.body.id;
        let commentPutRes = await commentRequests.deleteComment(token, commentId)
        expect(commentPutRes.status).toBe(StatusCode.NO_CONTENT_204);

        let commentByIdRes = await commentRequests.getCommentById(commentId);
        expect(commentByIdRes.status).toBe(StatusCode.NOT_FOUND__404)
    })
});