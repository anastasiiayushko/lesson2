import {Express} from "express";
import request from "supertest";
import {StatusCode} from "../../src/types/status-code-types";
import {SETTINGS} from "../../src/settings";
import {BlogInputModel} from "../../src/types/input-output-types/blog-types";
import {BLOG_INPUT_VALID} from "./testData";
import {app} from "../../src/app";

export const resetTestData = async (app: Express) => {
    await request(app).delete(`${SETTINGS.PATH.TESTING}/all-data`).expect(StatusCode.NO_CONTENT_204);
};

export const getAuthHeaderBasicTest = (auth: string) => {
    const encoded = Buffer.from(auth, 'utf8').toString('base64');
    return `Basic ${encoded}`;
};

export const generateRandomStringForTest = (lengthSymbols: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Набор символов
    let result = '';
    for (let i = 0; i < lengthSymbols; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export const createBlogTest = async (app: Express, blogData: BlogInputModel | {} = BLOG_INPUT_VALID, basicAuth:string) => {
    const response = await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .set({'Authorization': basicAuth})
        .send(blogData);
    // expect(response.status).toBe(StatusCode.CREATED_201);
    return response;
};