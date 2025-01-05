import {PostRepository} from "../dal/postRepository";
import {BlogRepository} from "../../blog/dal/blogRepository";
import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
import {BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {PostSchemaInputType} from "../../../db/types/db-post-type";
import {PostQueryRepository} from "../dal/postQueryRepository";


export class PostService {
    private _postRepo = new PostRepository();
    private _postQueryRepo = new PostQueryRepository();
    private _blogRepo = new BlogRepository();

    _mapperBodyPost = (body: PostInputModel): PostInputModel => {
        return {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
        }
    }


    getById = async (id: string): Promise<PostViewModel | null> => {
        return await this._postQueryRepo.getById(id);
    }
    createPost = async (body: PostInputModel): Promise<string | null> => {
        let postData = this._mapperBodyPost(body);
        let blog = await this._blogRepo.getById(postData.blogId);
        if (!blog) return null
        let createdAt = new Date().toISOString();
        let created = {
            ...postData,
            createdAt: createdAt,
            blogName: blog.name
        }
        return await this._postRepo.createPost(created);
    }
    updatePostById = async (id: string, body: PostInputModel): Promise<boolean> => {
        let postData = this._mapperBodyPost(body);
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
