import request, {Response} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {UserSchemaType} from "../../src/db/types/db-user-type";
import {BlogSchemaType} from "../../src/db/types/db-blog-type";
import {PostSchemaType} from "../../src/db/types/db-post-type";
import {blogCollection, postCollection} from "../../src/db/db";

const URL = SETTINGS.PATH.TESTING;

export type ResponseBodySuperTest<T = null> = Promise<Response & { body: T }>

export const testingRequests = {
    resetAll: async (): Promise<boolean> => {
        let res = await request(app).delete(URL + '/all-data');
        return res.status === 204
    },
    insertBlogsAndReturn: async (blogEntry: BlogSchemaType[]): Promise<BlogSchemaType[]> => {
        await blogCollection.insertMany(blogEntry)
        return blogEntry;

    },
    insertPostsAndReturn: async (postEntry: PostSchemaType[]): Promise<PostSchemaType[]> => {
         await  postCollection.insertMany(postEntry)
        return postEntry;

    },
    insertUsersAndReturn: async (userEntry: UserSchemaType[]): ResponseBodySuperTest<UserSchemaType[]> => {
        let users = await request(app).post(URL + '/users/insert').send(userEntry)
        return users.body;

    },

}