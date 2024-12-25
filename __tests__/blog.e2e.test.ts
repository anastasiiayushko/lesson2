import request, {Response} from "supertest";
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {StatusCode} from "../src/types/status-code-types";
import {BLOG_INPUT_VALID} from "./helpers/testData";
import {createBlogTest, generateRandomStringForTest, getAuthHeaderBasicTest, resetTestData} from "./helpers/testUtils";
import {BlogInputModelType} from "../src/types/input-output-types/blog-types";


let PATH_BLOG = SETTINGS.PATH.BLOGS;
let PATH_TEST = SETTINGS.PATH.TESTING;


const authHeaderBasicInvalid = getAuthHeaderBasicTest('admin:test')

const authHeaderBasicValid = getAuthHeaderBasicTest(SETTINGS.ADMIN)

const createBlog = async (blogData: BlogInputModelType | {} = BLOG_INPUT_VALID, basicAuth = authHeaderBasicValid): Promise<Response> => {
    return await createBlogTest(app, blogData, basicAuth)
};



describe("BLOG CREATE PROTECTED", () => {

    beforeEach(async () => {
        await resetTestData(app)
    });

    it("Create blog invalid basic auth. should be status 401", async () => {
        await request(app)
            .post(PATH_BLOG)
            .set({'Authorization': authHeaderBasicInvalid})
            .expect(StatusCode.UNAUTHORIZED_401)

        await request(app)
            .get(PATH_BLOG)
            .expect(StatusCode.OK_200, [])
    });

    it("Create blog incorrect empty data, should be errorsMessage and status 400", async () => {
        let res = await createBlog({});

        expect(res.body).toMatchObject({
            errorsMessages: expect.arrayContaining([
                expect.objectContaining({message: expect.any(String), field: "name"}),
                expect.objectContaining({message: expect.any(String), field: "description"}),
                expect.objectContaining({message: expect.any(String), field: "websiteUrl"})
            ])
        });
        expect(res.status).toBe(StatusCode.BAD_REQUEST_400);

        await request(app).get(PATH_BLOG).expect(StatusCode.OK_200, [])

    });
    it("Create incorrect field name empty, should be errorsMessage and status 400", async () => {
        let res = await createBlog({
            ...BLOG_INPUT_VALID,
            name: "",
        })
        expect(res.body).toEqual({
            errorsMessages: [
                {message: expect.any(String), field: "name"}
            ]
        })
        expect(res.status).toBe(StatusCode.BAD_REQUEST_400);
        await request(app).get(PATH_BLOG).expect(StatusCode.OK_200, [])
    });

    it("Create incorrect field name more than maxLen 15, should be errorsMessage and status 400", async () => {
        let nameMax = generateRandomStringForTest(16);
        let res = await createBlog({
            ...BLOG_INPUT_VALID,
            name: nameMax,
        })
        expect(res.body).toEqual({
            errorsMessages: [
                {message: expect.any(String), field: "name"}
            ]
        })
        expect(res.status).toBe(StatusCode.BAD_REQUEST_400);
        await request(app).get(PATH_BLOG).expect(StatusCode.OK_200, [])
    });

    it("Create data incorrect field description more then maxLen 500, should be errorsMessage and status 400", async () => {
        let descriptionMax = generateRandomStringForTest(501);
        let response = await createBlog({
            ...BLOG_INPUT_VALID,
            description: descriptionMax
        })

        expect(response.body).toMatchObject({
            errorsMessages: expect.arrayContaining([
                expect.objectContaining({message: expect.any(String), field: "description"}),
            ])
        })
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        await request(app)
            .get(PATH_BLOG)
            .expect(StatusCode.OK_200, [])
    });

    it("Create data incorrect field description empty, should be errorsMessage and status 400", async () => {
        let response = await createBlog({
            ...BLOG_INPUT_VALID,
            description: ""
        })

        expect(response.body).toMatchObject({
            errorsMessages: expect.arrayContaining([
                expect.objectContaining({message: expect.any(String), field: "description"}),
            ])
        })
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        await request(app)
            .get(PATH_BLOG)
            .expect(StatusCode.OK_200, [])
    });

    it("Create data incorrect field websiteUrl empty, should be errorsMessage and status 400", async () => {
        let response = await createBlog({
            ...BLOG_INPUT_VALID,
            websiteUrl: ""
        })

        expect(response.body).toMatchObject({
            errorsMessages: expect.arrayContaining([
                expect.objectContaining({message: expect.any(String), field: "websiteUrl"}),
            ])
        })
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);
        await request(app)
            .get(PATH_BLOG)
            .expect(StatusCode.OK_200, [])
    });

    it("Create data incorrect field websiteUrl, should be errorsMessage and status 400", async () => {
        let response = await createBlog({
            ...BLOG_INPUT_VALID,
            websiteUrl: "http://djsdkfjdks.asdfjadsfjadkljf.asdfjkadsfjdkf"
        })
        expect(response.body).toMatchObject({
            errorsMessages: expect.arrayContaining([
                expect.objectContaining({message: expect.any(String), field: "websiteUrl"}),
            ])
        })
        expect(response.status).toBe(StatusCode.BAD_REQUEST_400);

        await request(app).get(PATH_BLOG).expect(StatusCode.OK_200, [])
    });


    it("Should be create blog and status 201", async () => {
        let resCreated = await createBlog(BLOG_INPUT_VALID)

        expect(resCreated.status).toBe(StatusCode.CREATED_201);

        await request(app).get(`${PATH_BLOG}/${resCreated.body.id}`)
            .expect(StatusCode.OK_200, resCreated.body)

    })

});
describe("BLOG UPDATE PROTECTED", () => {

    beforeEach(async () => {
        await resetTestData(app);
    });

    it("Update blog by id correct data. should be status 204", async () => {
        let createdResponse = await createBlog(BLOG_INPUT_VALID);

        expect(createdResponse.body).toMatchObject({
            id: expect.any(String),
            createdAt: expect.any(String),
            isMembership: false,
            ...BLOG_INPUT_VALID,
        });

        let blogId = createdResponse.body.id;

        let updateBody = {
            name: BLOG_INPUT_VALID.name,
            description: 'update description',
            websiteUrl: BLOG_INPUT_VALID.websiteUrl,
        }

        await request(app)
            .put(`${PATH_BLOG}/${blogId}`)
            .set({'Authorization': authHeaderBasicValid})
            .send(updateBody)
            .expect(StatusCode.NO_CONTENT_204);

        let resUpdate = await request(app)
            .get(`${PATH_BLOG}/${blogId}`);
        expect(resUpdate.status).toBe(StatusCode.OK_200);
        expect(resUpdate.body).toMatchObject({
            ...updateBody,
            id: blogId,
            createdAt: expect.any(String),
            isMembership: false,
        })

    });

    it("Update blog not exist id. should be status 404", async () => {
        await request(app)
            .put(`${PATH_BLOG}/1`)
            .set({'Authorization': authHeaderBasicValid})
            .send(BLOG_INPUT_VALID)
            .expect(StatusCode.NOT_FOUND_404)
    });

    it("Update blog not invalid Auth. should be 401 ", async () => {
        let createdResponse = await createBlog(BLOG_INPUT_VALID);

        await request(app)
            .put(`${PATH_BLOG}/${createdResponse.body.id}`)
            .set({'Authorization': authHeaderBasicInvalid})
            .send({
                ...BLOG_INPUT_VALID,
                name: "update title use invalid auth"
            })
            .expect(StatusCode.UNAUTHORIZED_401)

        await request(app).get(PATH_BLOG + "/" + createdResponse.body.id).expect(StatusCode.OK_200, createdResponse.body)

    });

    it("Update blog by id not correct field websiteUrl. should be 400", async () => {
        let createdResponse = await createBlog(BLOG_INPUT_VALID);
        expect(createdResponse.body).toMatchObject({
            id: expect.any(String),  // id должно быть строкой
            createdAt: expect.any(String),
            isMembership: false,
            ...BLOG_INPUT_VALID     // остальные поля должны совпасть с BLOG_INPUT_VALID
        });
        let blogId = createdResponse.body.id;
        let updateBody = {
            name: BLOG_INPUT_VALID.name,
            description: generateRandomStringForTest(15),
            websiteUrl: generateRandomStringForTest(15),
        }

        let updateResponse = await request(app)
            .put(`${PATH_BLOG}/${blogId}`)
            .set({'Authorization': authHeaderBasicValid})
            .send(updateBody)
            .expect(StatusCode.BAD_REQUEST_400);

        expect(updateResponse.body)
            .toEqual({errorsMessages: [{"field": "websiteUrl", "message": expect.any(String)}]})

        await request(app)
            .get(`${PATH_BLOG}/${blogId}`)
            .expect(StatusCode.OK_200, createdResponse.body);
    });
});


describe("BLOG DELETE PROTECTED", () => {

    beforeEach(async () => {
        await resetTestData(app);
    });

    it("Delete blog invalid auth. should be status 401", async () => {
        let createdResponse = await createBlog(BLOG_INPUT_VALID);
        let blogId = createdResponse.body.id;
        expect(createdResponse.status).toBe(StatusCode.CREATED_201);
        expect(createdResponse.body).toMatchObject({
            ...BLOG_INPUT_VALID,
            id: blogId,
            createdAt: expect.any(String),
            isMembership: false,
        });

        await request(app)
            .delete(`${PATH_BLOG}/${blogId}`)
            .set({'Authorization': authHeaderBasicInvalid})
            .expect(StatusCode.UNAUTHORIZED_401);

        await request(app)
            .get(`${PATH_BLOG}/${blogId}`)
            .expect(StatusCode.OK_200, createdResponse.body);
    });

    it("Delete blog not existing id. should be status 404", async () => {
        await createBlog(BLOG_INPUT_VALID);

        await request(app)
            .delete(`${PATH_BLOG}/8k88k1374467755`)
            .set({'Authorization': authHeaderBasicValid})
            .expect(StatusCode.NOT_FOUND_404);

        let blogResponse = await request(app).get(PATH_BLOG).expect(StatusCode.OK_200)
        expect(blogResponse.body.length).toEqual(1)
    });

    it("Delete blog by id. should be status 204", async () => {
        let createdResponse = await createBlog(BLOG_INPUT_VALID);

        let blogId = createdResponse.body.id;

        await request(app).get(PATH_BLOG + '/' + blogId)
            .expect(StatusCode.OK_200, createdResponse.body)

        await request(app)
            .delete(`${PATH_BLOG}/${blogId}`)
            .set({'Authorization': authHeaderBasicValid})
            .expect(StatusCode.NO_CONTENT_204)

        await request(app).get(PATH_BLOG).expect(StatusCode.OK_200, [])
    });
});


describe("BLOG PUBLIC", () => {

    beforeEach(async () => {
        await resetTestData(app)

    });

    it("Get a list blogs in empty collection. Should be status 200 and []", async () => {
        await request(app).get(PATH_BLOG).expect(StatusCode.OK_200, [])
    });
    it("Get a blog using a non-existent id from an empty collection", async () => {
        await request(app).get(PATH_BLOG + "/" + "12345").expect(StatusCode.NOT_FOUND_404)
    });
    it("Get a list blogs in not empty collection. Should be status 200", async () => {
        await createBlog(BLOG_INPUT_VALID);
        let res = await request(app)
            .get(PATH_BLOG)
            .expect(StatusCode.OK_200);
        expect(res.body.length).toBe(1)
    });
    it("Get blog by existing id. should be status 200 and resource", async () => {
        let createdResponse = await createBlog(BLOG_INPUT_VALID);
        expect(createdResponse.status).toBe(StatusCode.CREATED_201);
        let blog = createdResponse.body;
        let blogId = blog.id;
        await request(app)
            .get(PATH_BLOG + "/" + blogId)
            .expect(StatusCode.OK_200, blog);

    });
});