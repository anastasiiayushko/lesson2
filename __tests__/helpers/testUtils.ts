import {Express} from "express";
import request, {Response} from "supertest";
import {StatusCode} from "../../src/types/status-code-types";
import {SETTINGS} from "../../src/settings";
import {BlogInputModelType} from "../../src/types/input-output-types/blog-types";
import {BLOG_INPUT_VALID} from "./testData";
import {BlogQueryInputType} from "../../src/db/types/db-blog-type";
import {FilterType, SortDirectionsType} from "../../src/db/types/db-types";
import {PostQueryInputType} from "../../src/db/types/db-post-type";


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

export const createBlogTest = async (
    app: Express,
    blogData: BlogInputModelType | {} = BLOG_INPUT_VALID,
    basicAuth: string): Promise<Response> => {
    const response = await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .set({'Authorization': basicAuth})
        .send(blogData);
    return response;
};


type BLOG_QUERY_TESTING = FilterType<BlogQueryInputType>

export const getPagingBlogQuery = async (app: Express, query?: BLOG_QUERY_TESTING) => {
    let _query = query ? query : {};

    const res = await request(app)
        .get(SETTINGS.PATH.BLOGS)
        .query(_query)
        .expect(StatusCode.OK_200);

    return res;
}
type POST_QUERY_TESTING = FilterType<PostQueryInputType>
export const getPagingPostQuery = async (app: Express, query?: POST_QUERY_TESTING) => {
    let _query = query ? query : {};
    const res = await request(app)
        .get(SETTINGS.PATH.POSTS)
        .query(_query)
        .expect(StatusCode.OK_200);

    return res;
}

export const sortedBySortKeyAndDirectionTest = <T>(data: T[], sortBy: keyof T, direction: SortDirectionsType) => {
    return data.sort((a, b) => {
        const valueA = String(a[sortBy]).toLowerCase(); // Приводим к строке и в нижний регистр
        const valueB = String(b[sortBy]).toLowerCase();

        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}