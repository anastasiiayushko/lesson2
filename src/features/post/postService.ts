import {postCollection} from "../../db/db";
import {PostSchemaInputType, PostSchemaType} from "../../db/db-types";
import {generateDbId} from "../../db/generateDbId";
import {ObjectId} from "mongodb";
import {PostRepository} from "./postRepository";
import {BlogRepository} from "../blog/blogRepository";
import {PostInputModel, PostViewModel} from "../../types/input-output-types/post-types";
import {BlogViewModelType} from "../../types/input-output-types/blog-types";


export class PostService {
    private _postRepo = new PostRepository();
    private _blogRepo = new BlogRepository();

    getAll = async (): Promise<PostViewModel[]> => {
        return await this._postRepo.getAll();
    }

    getById = async (id: string): Promise<PostViewModel | null> => {
        return await this._postRepo.getById(id);
    }
    createPost = async (postData: PostInputModel): Promise<PostViewModel> => {
        let blog = await this._blogRepo.getById(postData.blogId) as BlogViewModelType;
        let createdAt = new Date().toISOString();
        let created = {
            id: generateDbId(),
            ...postData,
            createdAt: createdAt,
            blogName: blog.name
        }
        return await this._postRepo.createPost(created);
    }
    updatePostById = async (id: string, postData: PostInputModel): Promise<boolean> => {
        let blog = await this._blogRepo.getById(postData.blogId) as BlogViewModelType;

        let postUpdate: PostSchemaInputType = {
            ...postData,
            blogName: blog.name
        }
        return await this._postRepo.updatePostById(id, postUpdate)
    }

    delPostById = async (id: string): Promise<boolean> => {
        return await this._postRepo.delPostById(id);
    }
}
