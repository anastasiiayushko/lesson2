import {BlogInputModelType} from "../../src/types/input-output-types/blog-types";
import {PostInputModel} from "../../src/types/input-output-types/post-types";


export const BLOG_INPUT_VALID: BlogInputModelType = {
    name: "string",
    description: "string",
    websiteUrl: "https://test-domain.com"
};

export const POST_INPUT_VALID_WITHOUT_BLOG_ID: Omit<PostInputModel, 'blogId'> = {
    title: "title",
    shortDescription: "shortDescription",
    content: "content",

};

