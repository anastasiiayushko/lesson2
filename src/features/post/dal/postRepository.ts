import {postCollection} from "../../../db/db";
import {PostSchemaInputType, PostSchemaType} from "../../../db/types/db-post-type";
import {PostViewModel} from "../../../types/input-output-types/post-types";
import {ObjectId} from "mongodb";


export class PostRepository {
    _mapperPostViewModel = (item: PostSchemaType): PostViewModel => {
        return {
            id: item._id.toString(),
            title: item.title,
            shortDescription: item.shortDescription,
            content: item.content,
            blogId: item.blogId.toString(),
            blogName: item.blogName,
            createdAt: item.createdAt,
        }
    }
    getAll = async (): Promise<PostViewModel[]> => {
        let posts = await postCollection.find({}).toArray();
        return posts.map(this._mapperPostViewModel)
    }

    getById = async (id: string): Promise<PostViewModel | null> => {
        let post = await postCollection.findOne({_id: new ObjectId(id)});
        if (!post) {
            return null
        }
        return this._mapperPostViewModel(post);
    }
    createPost = async (postData: PostSchemaInputType): Promise<string> => {
        let createdAt = new Date().toISOString();
        let created = {
            _id: new ObjectId(),
            ...postData,
            createdAt: createdAt
        }
        let res = await postCollection.insertOne(created);

        return res.insertedId!.toString();
    }
    updatePostById = async (id: string, postData: PostSchemaInputType): Promise<boolean> => {
        let res = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: postData});
        return res.matchedCount === 1;
    }

    delPostById = async (id: string): Promise<boolean> => {
        let res = await postCollection.deleteOne({_id: new ObjectId(id)});
        return res.deletedCount === 1;
    }
}
