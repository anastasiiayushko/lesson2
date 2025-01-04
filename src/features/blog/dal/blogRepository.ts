import {blogCollection} from "../../../db/db";
import {BlogCreateSchemaType, BlogSchemaInputType, BlogSchemaType} from "../../../db/db-blog-type";
import {BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {ObjectId} from "mongodb";


export class BlogRepository {
    // private db: BlogSchema[];

    constructor() {
    }

    _mapperBlog = (item: BlogSchemaType): BlogViewModelType => {
        return {
            id: item._id.toString(),
            name: item.name,
            websiteUrl: item.websiteUrl,
            description: item.description,
            createdAt: item.createdAt,
            isMembership: item.isMembership
        }
    }
    getAll = async (): Promise<BlogViewModelType[]> => {
        let blogs = await blogCollection.find({}).toArray();
        return blogs.map(this._mapperBlog);
    }
    getById = async (id: string): Promise<BlogViewModelType | null> => {
        let blog = await blogCollection.findOne({_id: new ObjectId(id)});
        if (!blog) {
            return null
        }
        return this._mapperBlog(blog);
    }

    createBlog = async (blogData:BlogCreateSchemaType): Promise<string> => {

        let res = await blogCollection.insertOne(blogData as BlogSchemaType);
        /** result operation insertOne
         acknowledged: true,
         insertedId: ObjectId('6764204f5f98221d8d97f09d')
         */
        return res.insertedId!.toString();

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
        let result = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: blogUpdate});

        return result.matchedCount === 1;
    }

    deleteDyId = async (id: string): Promise<boolean> => {
        let result = await blogCollection.deleteOne({_id: new ObjectId(id)});
        /**
         * { acknowledged: true, deletedCount: 1 } */
        return result.deletedCount === 1;

    }
}

