import {BlogViewModel} from "../types/input-output-types/blog-types";
import {BlogSchema, PostSchema} from "./db-types";

export type DBType = {
    blogs: BlogSchema [],
    posts: PostSchema[]
}
export const db: DBType = {
    blogs: [],
    posts: []
}

export const setDB = (dataset: Partial<DBType> | null) => {
    if (!dataset) {
        db.blogs = [];
        db.posts = [];
        return;
    }
    db.blogs = dataset.blogs || db.blogs;
    db.posts = dataset.posts || db.posts;
}