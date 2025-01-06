import request from "supertest";
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {
    generateRandomStringForTest,
    getAuthHeaderBasicTest,
    resetTestData
} from "./helpers/testUtils";
import {BlogInputModelType} from "../src/types/input-output-types/blog-types";
import {BLOG_INPUT_VALID, POST_INPUT_VALID_WITHOUT_BLOG_ID} from "./helpers/testData";
import {StatusCode} from "../src/types/status-code-types";
import {PostInputModel} from "../src/types/input-output-types/post-types";
import {ObjectId} from "mongodb";
import {createBlogTestRequest} from "./helpers/blogsUtils";
import {fetchPostsWithPagingTest} from "./helpers/postsUtils";

let PATH_POST = SETTINGS.PATH.POSTS;


const authHeaderBasicInvalid = getAuthHeaderBasicTest('admin:test')
const authHeaderBasicValid = getAuthHeaderBasicTest(SETTINGS.ADMIN)

const createBlog = async (blogData: BlogInputModelType | {} = BLOG_INPUT_VALID, basicAuth = authHeaderBasicValid) => {
    return await createBlogTestRequest(app, blogData, basicAuth);
};
const createPost = async (postData: PostInputModel | {}, basicAuth = authHeaderBasicValid) => {
    return await request(app)
        .post(PATH_POST)
        .set({'Authorization': basicAuth})
        .send(postData);
}
describe("POST CREATE PROTECTED", () => {
    beforeEach(async () => {
        await resetTestData(app);
    });

    it("Should be 401, invalid basic auth", async () => {
        let blogCreateResponse = await createBlog();
        expect(blogCreateResponse.status).toBe(StatusCode.CREATED_201);

        let res = await createPost({
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blogCreateResponse.body.id,
        }, authHeaderBasicInvalid)

        expect(res.status).toBe(StatusCode.UNAUTHORIZED_401);

        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);

    });

    it("Should be 201, correct data and basic auth", async () => {
        let blogResponse = await createBlog();

        let blog = blogResponse.body;
        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.id,
        }

        let resCreatePost = await createPost(passedPost);
        expect(resCreatePost.status).toBe(StatusCode.CREATED_201);

        let postId = resCreatePost.body.id;
        let expectedPost = {
            ...passedPost,
            id: postId,
            blogName: blog.name,
            createdAt: expect.any(String),
        }
        expect(resCreatePost.body).toMatchObject(expectedPost);

        let resPostById = await request(app).get(`${PATH_POST}/${postId}`)
        expect(resPostById.status).toBe(StatusCode.OK_200);
        expect(resPostById.body).toMatchObject(expectedPost)

    });
    it("Should be 201, correct data and basic auth and adding not existing field", async () => {
        let blogResponse = await createBlog();

        let blog = blogResponse.body;
        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.id,
        }

        let resCreatPost = await createPost({...passedPost, test: "test"});
        expect(resCreatPost.status).toBe(StatusCode.CREATED_201);

        let postId = resCreatPost.body.id;
        let expectedPost = {
            ...passedPost,
            id: postId,
            blogName: blog.name,
            createdAt: expect.any(String),
        }
        expect(resCreatPost.body).toMatchObject(expectedPost);

        let resPostById = await request(app).get(`${PATH_POST}/${postId}`);
        expect(resPostById.status).toBe(StatusCode.OK_200);
        expect(resPostById.body).toMatchObject(expectedPost)

    });

    it("Should be 400, send blogId existing blog", async () => {
        let blogResponse = await createBlog();
        let blogId = new ObjectId();
        let blog = blogResponse.body;
        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blogId.toString()
        }

        let response = await createPost(passedPost);
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "blogId",
                    message: expect.any(String)
                }
            ]
        })

        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);
    });
    it("Should be 400, blogId empty", async () => {
        let blogResponse = await createBlog();

        let blog = blogResponse.body;
        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: ""
        }

        let response = await createPost(passedPost);
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "blogId",
                    message: expect.any(String)
                }
            ]
        })
        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);
    });


    it("Should be 400, title maxLen more than 30", async () => {
        let blogResponse = await createBlog();

        let blog = blogResponse.body;
        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            title: generateRandomStringForTest(31),
            blogId: blog.id
        }

        let response = await createPost(passedPost);
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "title",
                    message: expect.any(String)
                }
            ]
        })
        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);
    });
    it("Should be 400, title empty", async () => {
        let blogResponse = await createBlog();

        let blog = blogResponse.body;
        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.id,
            title: ""
        }

        let response = await createPost(passedPost);
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "title",
                    message: expect.any(String)
                }
            ]
        })

        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);
    });

    it("Should be 400, shortDescription maxLen more than 100", async () => {
        let blogResponse = await createBlog();

        let blog = blogResponse.body;
        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            shortDescription: generateRandomStringForTest(101),
            blogId: blog.id
        }

        let response = await createPost(passedPost);
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "shortDescription",
                    message: expect.any(String)
                }
            ]
        })

        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);
    });
    it("Should be 400, shortDescription empty", async () => {
        let blog = await createBlog();


        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.body.id,
            shortDescription: ""
        }

        let response = await createPost(passedPost);
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "shortDescription",
                    message: expect.any(String)
                }
            ]
        })
        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);
    });

    it("Should be 400, content maxLen more than 1001", async () => {
        let blogResponse = await createBlog();

        let blog = blogResponse.body;
        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            content: generateRandomStringForTest(1001),
            blogId: blog.id
        }

        let response = await createPost(passedPost);
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "content",
                    message: expect.any(String)
                }
            ]
        })
        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);
    });
    it("Should be 400, content empty", async () => {
        let blogResponse = await createBlog();

        let blog = blogResponse.body;
        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.id,
            content: ""
        }

        let response = await createPost(passedPost);
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "content",
                    message: expect.any(String)
                }
            ]
        })
        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);
    });


    it("Should be 400, not corrected type field", async () => {
        let blogResponse = await createBlog();

        let blog = blogResponse.body;
        let passedPost = {
            blogId: blog.id,
            content: 1234,
            shortDescription: null,
            title: function () {
            }
        }

        let response = await createPost(passedPost);
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "title",
                    message: expect.any(String)
                },
                {
                    field: "shortDescription",
                    message: expect.any(String)
                },
                {
                    field: "content",
                    message: expect.any(String)
                }
            ]
        })

        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);
    });

});


describe("POST UPDATE PROTECTED", () => {
    beforeEach(async () => {
        await resetTestData(app)
    })
    it("Should be 401, invalid basic auth", async () => {
        let blogCreateResponse = await createBlog();
        expect(blogCreateResponse.status).toBe(StatusCode.CREATED_201);

        let res = await createPost({
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blogCreateResponse.body.id
        }, authHeaderBasicValid);

        await request(app)
            .put(PATH_POST + '/' + res.body.id)
            .set({'Authorization': authHeaderBasicInvalid})
            .send({
                ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
                title: generateRandomStringForTest(8)
            })
            .expect(StatusCode.UNAUTHORIZED_401)

        await request(app).get(PATH_POST + '/' + res.body.id).expect(StatusCode.OK_200, res.body)

    });

    it("Should be 204", async () => {
        let blogCreateResponse = await createBlog();
        let blog = blogCreateResponse.body;
        expect(blogCreateResponse.status).toBe(StatusCode.CREATED_201);

        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.id
        }

        let res = await createPost(passedPost, authHeaderBasicValid);
        let postId = res.body.id;

        let expectPost = {
            ...passedPost,
            blogName: blog.name,
            title: generateRandomStringForTest(8),
        }
        await request(app)
            .put(PATH_POST + '/' + postId)
            .set({'Authorization': authHeaderBasicValid})
            .send(expectPost)
            .expect(StatusCode.NO_CONTENT_204)

        let resPostById = await request(app).get(PATH_POST + '/' + postId)
        expect(resPostById.status).toBe(StatusCode.OK_200);
        expect(resPostById.body).toMatchObject({
            id: postId,
            ...expectPost,
        })

    });

    it("Should be 404 not existing post id", async () => {
        let blogCreateResponse = await createBlog();
        let blog = blogCreateResponse.body;

        expect(blogCreateResponse.status).toBe(StatusCode.CREATED_201);

        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.id
        }

        let res = await createPost(passedPost, authHeaderBasicValid);
        let postId = res.body.id;

        let expectPost = {
            ...passedPost,
            blogName: blog.name,
            title: generateRandomStringForTest(8)
        }
        let invalidPostId = new ObjectId()
        await request(app)
            .put(PATH_POST + '/' + invalidPostId)
            .set({'Authorization': authHeaderBasicValid})
            .send(expectPost)
            .expect(StatusCode.NOT_FOUND_404)


        await request(app).get(PATH_POST + '/' + postId).expect(StatusCode.OK_200, res.body)

    });

    it("Should be 400 not correct data input title", async () => {
        let blogCreateResponse = await createBlog();
        let blog = blogCreateResponse.body;

        expect(blogCreateResponse.status).toBe(StatusCode.CREATED_201);

        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.id
        }

        let res = await createPost(passedPost, authHeaderBasicValid);
        let postId = res.body.id;

        let expectPost = {
            ...passedPost,
            blogName: blog.name,
            title: generateRandomStringForTest(101)
        }
        await request(app)
            .put(PATH_POST + '/' + postId)
            .set({'Authorization': authHeaderBasicValid})
            .send(expectPost)
            .expect(StatusCode.BAD_REQUEST_400)


        await request(app).get(PATH_POST + '/' + postId).expect(StatusCode.OK_200, res.body)

    });
})

describe("POST DELETE PROTECTED", () => {
    beforeEach(async () => {
        await resetTestData(app)
    })
    it("Should be 401, invalid basic auth", async () => {
        let blogCreateResponse = await createBlog();
        expect(blogCreateResponse.status).toBe(StatusCode.CREATED_201);

        let res = await createPost({
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blogCreateResponse.body.id
        }, authHeaderBasicValid);

        await request(app)
            .delete(PATH_POST + '/' + res.body.id)
            .set({'Authorization': authHeaderBasicInvalid})
            .expect(StatusCode.UNAUTHORIZED_401)

        await request(app).get(PATH_POST + '/' + res.body.id).expect(StatusCode.OK_200, res.body)

    });

    it("Should be 204", async () => {
        let blogCreateResponse = await createBlog();
        let blog = blogCreateResponse.body;
        expect(blogCreateResponse.status).toBe(StatusCode.CREATED_201);

        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.id
        }

        let res = await createPost(passedPost, authHeaderBasicValid);
        let postId = res.body.id;

        await request(app)
            .delete(PATH_POST + '/' + postId)
            .set({'Authorization': authHeaderBasicValid})
            .expect(StatusCode.NO_CONTENT_204)

        const posts = await fetchPostsWithPagingTest(app);
        expect(posts.body.items.length).toBe(0);

    });

    it("Should be 404 not existing post id", async () => {
        let blogCreateResponse = await createBlog();
        let blog = blogCreateResponse.body;

        expect(blogCreateResponse.status).toBe(StatusCode.CREATED_201);

        let passedPost = {
            ...POST_INPUT_VALID_WITHOUT_BLOG_ID,
            blogId: blog.id
        }

        let res = await createPost(passedPost, authHeaderBasicValid);
        let postId = res.body.id;
        let invalidPostId = new ObjectId()
        await request(app)
            .delete(PATH_POST + '/' + invalidPostId.toString())
            .set({'Authorization': authHeaderBasicValid})
            .expect(StatusCode.NOT_FOUND_404)


        await request(app).get(PATH_POST + '/' + postId).expect(StatusCode.OK_200, res.body)

    });

})


describe("POST PUBLIC", () => {
    let blog = null; // Переменная для хранения  созданного блога
    beforeAll(async () => {
        await resetTestData(app);

        const blogResponse = await createBlog(BLOG_INPUT_VALID, authHeaderBasicValid);

        blog = blogResponse.body;
        expect(blogResponse.statusCode).toBe(StatusCode.CREATED_201);
        expect(blog.id).toBeDefined();


    });


    it("Should be returns blog paging is default query params ", async () => {

        const postsData: PostInputModel[] = [
            {
                title: "Post 1",
                content: "Content for Post 1",
                shortDescription: "Description for Post 1",
                blogId: blog!.id,
            },
            {
                title: "Post 2",
                content: "Content for Post 2",
                shortDescription: "Description for Post 2",
                blogId: blog!.id,
            },
            {
                title: "Post 3",
                content: "Content for Post 3",
                shortDescription: "Description for Post 3",
                blogId: blog!.id,
            },
            {
                title: "Post 4",
                content: "Content for Post 4",
                shortDescription: "Description for Post 4",
                blogId: blog!.id,
            },
            {
                title: "Post 5",
                content: "Content for Post 5",
                shortDescription: "Description for Post 5",
                blogId: blog!.id,
            }
        ];

        for (const postData of postsData) {
            const postResponse = await createPost(postData, authHeaderBasicValid);

            // Проверка успешного создания поста
            expect(postResponse.statusCode).toBe(StatusCode.CREATED_201);
            expect(postResponse.body.blogId).toBe(blog!.id);
            expect(postResponse.body.title).toBe(postData.title);
            expect(postResponse.body.content).toBe(postData.content);
        }

        let totalDocuments = 5;
        let defaultPageSize = 2;
        let expectedPagesCount = Math.ceil(totalDocuments / defaultPageSize);

        let res = await fetchPostsWithPagingTest(app, {pageSize:defaultPageSize});
        let body = res.body;

        expect(body.totalCount).toBe(totalDocuments);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(defaultPageSize);
        expect(body.pagesCount).toBe(expectedPagesCount);
        expect(body.items.length).toBe(2);
        expect(res.statusCode).toBe(StatusCode.OK_200);
    })

    it("should be find post empty array and status 404 ", async () => {
        let invalidPostId = new ObjectId()
        await request(app).get(PATH_POST + "/" + invalidPostId.toString()).expect(StatusCode.NOT_FOUND_404)
    })
})