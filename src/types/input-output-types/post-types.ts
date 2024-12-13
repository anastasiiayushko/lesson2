import {BlogSchema, BlogSchemaInput, PostSchema, PostSchemaInput} from "../../db/db-types";


export type BlogViewModel = BlogSchema;
export type BlogInputModel = BlogSchemaInput;

export type PostViewModel = PostSchema;
export type PostInputModel = Omit<PostSchemaInput, 'blogName'>;