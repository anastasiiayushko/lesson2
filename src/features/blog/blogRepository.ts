import {db, DBType} from "../../db/db";
import {BlogSchema, BlogSchemaInput} from "../../db/db-types";
import {generateDbId} from "../../db/generateDbId";

export class BlogRepository {
    // private db: BlogSchema[];

    constructor() {
        // this.db = db.blogs;
    }

    getAll = (): BlogSchema[] => {
        return db.blogs;
    }
    getById = (id: string): BlogSchema | null => {
        return db.blogs.find(doc => doc.id === id) ?? null;
    }

    createBlog = (blogData: Omit<BlogSchema, 'id'>): BlogSchema => {
        let id: string = generateDbId();
        let createBlog = {
            ...blogData,
            id: id
        }
        db.blogs.push(createBlog);
        return createBlog;
    }
    // Omit<"BlogSchema", "id">
    updateById = (id: string, blogUpdate: BlogSchemaInput) => {
        db.blogs = db.blogs.map(doc => {
            if (doc.id === id) {
                return {
                    ...doc,
                    ...blogUpdate
                }
            }
            return doc;
        });
    }
    deleteDyId = (id: string) => {
        db.blogs = db.blogs.filter(doc => doc.id !== id);
    }
}

