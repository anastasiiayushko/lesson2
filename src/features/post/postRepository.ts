import {postCollection} from "../../db/db";
import {PostSchemaInputType, PostSchemaType} from "../../db/db-types";
import {generateDbId} from "../../db/generateDbId";
import {ObjectId} from "mongodb";

type MapperExcludeType = PostSchemaType & {
    _id?: ObjectId
}

export class PostRepository {
    _mapperExcludeObjectId = (item: MapperExcludeType): PostSchemaType => {
        return {
            id: item.id,
            title: item.title,
            shortDescription: item.shortDescription,
            content: item.content,
            blogId: item.blogId,
            blogName: item.blogName,
            createdAt: item.createdAt,
        }
    }
    getAll = async (): Promise<PostSchemaType[]> => {
        return postCollection.find({}, {projection: {_id: 0}}).toArray();
    }

    getById = async (id: string): Promise<PostSchemaType | null> => {
        return await postCollection.findOne({id: id}, {projection: {_id: 0}});
    }
    createPost = async (postData: PostSchemaInputType): Promise<PostSchemaType> => {
        let createdAt = new Date().toISOString();
        let created = {
            id: generateDbId(),
            ...postData,
            createdAt: createdAt
        }
        await postCollection.insertOne(created);
        return this._mapperExcludeObjectId(created)
    }
    updatePostById = async (id: string, postData: PostSchemaInputType): Promise<boolean> => {
        let res = await postCollection.updateOne({id: id}, {$set: postData});
        return res.matchedCount === 1;
    }

    delPostById = async (id: string): Promise<boolean> => {
        let res = await postCollection.deleteOne({id: id});
        return res.deletedCount === 1;
    }
}
