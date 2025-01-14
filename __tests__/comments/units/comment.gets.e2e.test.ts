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

describe('Comment get by id', () => {
    beforeAll(async () => {
        await testingRequests.resetAll();
        await userRequests.createUser(BASIC_VALID_HEADER, userNika);
        await testingRequests.insertBlogsAndReturn([...BLOG_DATA_WITH_ID]);
        await testingRequests.insertPostsAndReturn([...postEntry]);
    })

    it("Should return 200 and resource", async () => {
        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password)
        let token = nikaLoginResult.body.accessToken;
        expect(token).toEqual(expect.any(String))
        /* create comment */
        let commentTargetPost = postEntry[0];
        let commentBody = generateRandomStringForTest(50)
        let commentRes = await commentRequests.createCommentByPostIdParams(token, commentTargetPost._id.toString(), commentBody);
        expect(commentRes.status).toBe(StatusCode.CREATED_201);
        expect(commentRes.body).toMatchObject<CommentViewModelType>({
            id: expect.any(String),
            createdAt: expect.any(String),
            content: commentBody,
            commentatorInfo: {userId: expect.any(String), userLogin: userNika.login},

        });
        /* find comment */
        const commentByIdRes = await commentRequests.getCommentById(commentRes.body.id);
        expect(commentByIdRes.status).toBe(StatusCode.OK_200);
        expect(commentByIdRes.body).toMatchObject<CommentViewModelType>(commentRes.body)
    })

    it("Should return 404 if commentId no existing", async () => {
        let nikaLoginResult = await authRequests.login(userNika.login, userNika.password)
        let token = nikaLoginResult.body.accessToken;

        let commentTargetPost = postEntry[0];
        let commentBody = generateRandomStringForTest(30)
        let commentRes = await commentRequests.createCommentByPostIdParams(token, commentTargetPost._id.toString(), commentBody);
        expect(commentRes.status).toBe(StatusCode.CREATED_201);

        let commentNoExist = new ObjectId().toString();
        const commentNotFoundRes = await commentRequests.getCommentById(commentNoExist)
        expect(commentNotFoundRes.status).toBe(StatusCode.NOT_FOUND__404);

        const commentExistingById = await commentRequests.getCommentById(commentRes.body.id);
        expect(commentExistingById.status).toBe(StatusCode.OK_200);
        expect(commentExistingById.body).toMatchObject<CommentViewModelType>(commentRes.body);
    })
});