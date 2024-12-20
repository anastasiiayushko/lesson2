import {blogCollection, db} from "../../db/db";
import {BlogSchemaInputType, BlogSchemaType} from "../../db/db-types";
import {generateDbId} from "../../db/generateDbId";
import {ObjectId} from "mongodb";

type MapperExcludeType = BlogSchemaType & {
    _id?: ObjectId
}

export class BlogRepository {
    // private db: BlogSchema[];

    constructor() {
    }

    _mapperExcludeObjectId = (item: MapperExcludeType): BlogSchemaType => {
        return {
            id: item.id,
            name: item.name,
            websiteUrl: item.websiteUrl,
            description: item.description,
            createdAt: item.createdAt,
            isMembership: item.isMembership
        }
    }
    getAll = async (): Promise<BlogSchemaType[]> => {
        return blogCollection.find({}, {projection: {_id: 0}}).toArray();
    }
    getById = async (id: string): Promise<BlogSchemaType | null> => {
        return await blogCollection.findOne({id: id}, {projection: {_id: 0}});
    }

    createBlog = async (blogData: BlogSchemaInputType): Promise<BlogSchemaType> => {
        let id: string = generateDbId();
        let createBlog = {
            ...blogData,
            id: id,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        await blogCollection.insertOne(createBlog);
        /** result operation insertOne
         acknowledged: true,
         insertedId: ObjectId('6764204f5f98221d8d97f09d')
         */
        return this._mapperExcludeObjectId(createBlog);

    }
    updateById = async (id: string,
                        blogUpdate: Omit<BlogSchemaInputType, 'createdAt' | 'isMembership'>): Promise<boolean> => {

        /**
         * acknowledged: true,
         insertedId: null,
         matchedCount: 1,
         modifiedCount: 1,
         upsertedCount: 0
         */
        let result = await blogCollection.updateOne({id: id}, {$set: blogUpdate});

        return result.matchedCount === 1;
    }

    deleteDyId = async (id: string): Promise<boolean> => {
        let result = await blogCollection.deleteOne({id: id});
        /**
         * { acknowledged: true, deletedCount: 1 } */
        return result.deletedCount === 1;

    }
}

