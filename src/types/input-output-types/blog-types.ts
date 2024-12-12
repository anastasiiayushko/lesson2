import {BlogSchema, BlogSchemaInput} from "../../db/db-types";

// export type BlogInputModel = {
//     name: string // max 15
//     description: string // max 500
//     websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
// }

export type BlogViewModel = BlogSchema;
export type BlogInputModel = BlogSchemaInput;

// export type BlogViewModel = {
//     id: string
//     name: string // max 15
//     description: string // max 500
//     websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
// }