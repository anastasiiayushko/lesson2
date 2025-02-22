import {postCollection} from "../../../db/db";
import {PostSchemaInputType, PostSchemaType} from "../../../db/types/db-post-type";
import {PostViewModel} from "../../../types/input-output-types/post-types";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";


@injectable()
export class PostRepository {
    _mapperPostViewModel(item: PostSchemaType): PostViewModel {
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


    async getById(id: string): Promise<PostViewModel | null> {
        let post = await postCollection.findOne({_id: new ObjectId(id)});
        if (!post) {
            return null
        }
        return this._mapperPostViewModel(post);
    }

    async createPost(postData: PostSchemaInputType): Promise<string> {
        let createdAt = new Date().toISOString();
        let created = {
            _id: new ObjectId(),
            ...postData,
            createdAt: createdAt
        }
        let res = await postCollection.insertOne(created);

        return res.insertedId!.toString();
    }

    async updatePostById(id: string, postData: PostSchemaInputType): Promise<boolean> {
        let res = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: postData});
        return res.matchedCount === 1;
    }

    async delPostById(id: string): Promise<boolean> {
        let res = await postCollection.deleteOne({_id: new ObjectId(id)});
        return res.deletedCount === 1;
    }
}
