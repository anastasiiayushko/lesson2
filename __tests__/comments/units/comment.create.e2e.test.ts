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
import {ApiErrorResultType} from "../../../src/types/output-error-types";
import {jwtService} from "../../../src/app/jwtService";

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
    }
]

describe('Comment create', () => {
    beforeAll(async () => {
        await testingRequests.resetAll();
        await userRequests.createUser(BASIC_VALID_HEADER, userNika);
        await userRequests.createUser(BASIC_VALID_HEADER, userIgor);
        await testingRequests.insertBlogsAndReturn([...BLOG_DATA_WITH_ID]);
        await testingRequests.insertPostsAndReturn([...postEntry]);
    })

    it("Should return 201  success  and created resource comment", async () => {
        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password)
        let token = nikaLoginResult.body.accessToken;
        expect(token).toEqual(expect.any(String))

        let commentTargetPost = postEntry[0];
        let commentBody = generateRandomStringForTest(50)
        let commentRes = await commentRequests.createCommentByPostIdParams(token, commentTargetPost._id.toString(), commentBody);
        expect(commentRes.status).toBe(StatusCode.CREATED_201);
        expect(commentRes.body).toEqual<CommentViewModelType>({
            id: expect.any(String),
            createdAt: expect.any(String),
            content: commentBody,
            commentatorInfo: {userId: expect.any(String), userLogin: userNika.login},
        });
    })

    it("Should return 401 if no token is provided", async () => {
        await authRequests.login(userNika.login, userNika.password)
        let token = await jwtService.createAccessToken(new ObjectId().toString())

        let commentTargetPost = postEntry[0];
        let commentBody = generateRandomStringForTest(50)
        let commentRes = await commentRequests.createCommentByPostIdParams(token, commentTargetPost._id.toString(), commentBody);
        expect(commentRes.status).toBe(StatusCode.UNAUTHORIZED_401);
    })

    it("Should return 400 if body content less 20", async () => {
        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password)
        let token = nikaLoginResult.body.accessToken;

        let commentTargetPost = postEntry[0];
        let commentBody = generateRandomStringForTest(19)
        let commentRes = await commentRequests.createCommentByPostIdParams(token, commentTargetPost._id.toString(), commentBody);
        expect(commentRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(commentRes.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: 'content', message: expect.any(String)}
            ]
        })
    })
    it("Should return 400 if body content more 300", async () => {
        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password)
        let token = nikaLoginResult.body.accessToken;

        let commentTargetPost = postEntry[0];
        let commentBody = generateRandomStringForTest(301)
        let commentRes = await commentRequests.createCommentByPostIdParams(token, commentTargetPost._id.toString(), commentBody);
        expect(commentRes.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(commentRes.body).toMatchObject<ApiErrorResultType>({
            errorsMessages: [
                {field: 'content', message: expect.any(String)}
            ]
        })
    })

    it("Should return 404 if postId no existing", async () => {
        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password)
        let token = nikaLoginResult.body.accessToken;

        let commentTargetPost = {_id: new ObjectId()};
        let commentBody = generateRandomStringForTest(30)
        let commentRes = await commentRequests.createCommentByPostIdParams(token, commentTargetPost._id.toString(), commentBody);
        expect(commentRes.status).toBe(StatusCode.NOT_FOUND__404);

    })
});