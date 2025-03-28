// import {PostRepository} from "../infrastructure/repositories/postRepository";
// import {BlogRepository} from "../../blog/dal/blogRepository";
// import {PostInputModel, PostViewModel} from "../../../types/input-output-types/post-types";
// import {BlogViewModelType} from "../../../types/input-output-types/blog-types";
// import {PostSchemaInputType} from "../../../db/types/db-post-type";
// import {injectable} from "inversify";
//
//
// @injectable()
// export class PostService {
//
//     constructor(protected postRepository: PostRepository,
//                 protected postQueryRepository: PostQueryRepository,
//                 protected blogRepository: BlogRepository,
//     ) {}
//
//     _mapperBodyPost = (body: PostInputModel): PostInputModel => {
//         return {
//             title: body.title,
//             shortDescription: body.shortDescription,
//             content: body.content,
//             blogId: body.blogId,
//         }
//     }
//
//
//     async getById(id: string): Promise<PostViewModel | null> {
//         return await this.postQueryRepository.getById(id);
//     }
//
//     async createPost(body: PostInputModel): Promise<string | null> {
//         let postData = this._mapperBodyPost(body);
//         let blog = await this.blogRepository.getById(postData.blogId);
//         if (!blog) return null
//         let createdAt = new Date().toISOString();
//         let created = {
//             ...postData,
//             createdAt: createdAt,
//             blogName: blog.name
//         }
//         return await this.postRepository.createPost(created);
//     }
//
//     async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
//         let postData = this._mapperBodyPost(body);
//         let blog = await this.blogRepository.getById(postData.blogId) as BlogViewModelType;
//
//         let postUpdate: PostSchemaInputType = {
//             ...postData,
//             blogName: blog.name
//         }
//         return await this.postRepository.updatePostById(id, postUpdate)
//     }
//
//     async delPostById(id: string): Promise<boolean> {
//         return await this.postRepository.delPostById(id);
//     }
// }
