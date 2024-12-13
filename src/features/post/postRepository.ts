import {db} from "../../db/db";
import {PostSchema, PostSchemaInput} from "../../db/db-types";
import {generateDbId} from "../../db/generateDbId";

export class PostRepository {
    getAll = (): PostSchema[] => {
        return db.posts;
    }
    getById = (id: string): PostSchema | null => {
        let post = db.posts.find(doc => doc.id === id);
        if (post) {
            return post
        }
        return null
    }
    createPost = (postData: PostSchemaInput): PostSchema => {
        let created = {
            id: generateDbId(),
            ...postData,
        }
        db.posts.push(created);
        return created
    }
    updatePostById = (id: string, postData: PostSchemaInput): boolean => {
        db.posts = db.posts.map(doc => {
            if (doc.id === id) {
                return {
                    ...doc,
                    ...postData
                }
            }
            return doc
        })
        return true
    }

    delPostById = (id: string) => {
        db.posts = db.posts.filter(doc => doc.id !== id)
    }
}
