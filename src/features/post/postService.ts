import {generateDbId} from "../../db/generateDbId";
import {PostRepository} from "./postRepository";
import {BlogRepository} from "../blog/blogRepository";
import {PostInputModel, PostViewModel} from "../../types/input-output-types/post-types";
import {BlogViewModelType} from "../../types/input-output-types/blog-types";
import {PostQueryInputType, PostSchemaInputType} from "../../db/db-post-type";
import {PostQueryRepository} from "./postQueryRepository";
import {FilterType, PaginationViewModelType} from "../../db/db-types";


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
    getPostsWithPaging = async (query: PostQueryInputType,
                    filter?: FilterType<PostViewModel> | undefined): Promise<PaginationViewModelType<PostViewModel>> => {
        return await this._postQueryRepo.getPostQuery(query, filter);
    }

    getById = async (id: string): Promise<PostViewModel | null> => {
        return await this._postRepo.getById(id);
    }
    createPost = async (body: PostInputModel): Promise<PostViewModel | null> => {
        let postData = this._mapperBodyPost(body);
        let blog = await this._blogRepo.getById(postData.blogId);
        if (!blog) return null
        let createdAt = new Date().toISOString();
        let created = {
            id: generateDbId(),
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
