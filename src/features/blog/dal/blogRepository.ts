import {blogCollection} from "../../../db/db";
import {BlogCreateSchemaType, BlogSchemaInputType, BlogSchemaType} from "../../../db/types/db-blog-type";
import {BlogViewModelType} from "../../../types/input-output-types/blog-types";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class BlogRepository {

    _mapDbBlogToView(item: BlogSchemaType): BlogViewModelType {
        return {
            id: item._id.toString(),
            name: item.name,
            websiteUrl: item.websiteUrl,
            description: item.description,
            createdAt: item.createdAt,
            isMembership: item.isMembership
        }
    }


    async getById(id: string): Promise<BlogViewModelType | null> {
        let blog = await blogCollection.findOne({_id: new ObjectId(id)});
        if (!blog) {
            return null
        }
        return this._mapDbBlogToView(blog);
    }

    async createBlog(blogData: BlogCreateSchemaType): Promise<string> {

        let res = await blogCollection.insertOne(blogData as BlogSchemaType);
        /** result operation insertOne
         acknowledged: true,
         insertedId: ObjectId('6764204f5f98221d8d97f09d')
         */
        return res.insertedId!.toString();

    }

    async updateById(id: string,
                     blogUpdate: Omit<BlogSchemaInputType, 'createdAt' | 'isMembership'>): Promise<boolean> {

        let result = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: blogUpdate});

        return result.matchedCount === 1;
    }

    async deleteDyId(id: string): Promise<boolean> {
        let result = await blogCollection.deleteOne({_id: new ObjectId(id)});
        /**
         * { acknowledged: true, deletedCount: 1 } */
        return result.deletedCount === 1;

    }
}

